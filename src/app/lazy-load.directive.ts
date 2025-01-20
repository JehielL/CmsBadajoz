import { Directive, ElementRef, Input, Renderer2, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { openDB } from 'idb';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnChanges {
  @Input() imageUrl!: string;
  @Input() placeholderImage!: string;
  private observer: IntersectionObserver | undefined;
  private static readonly MAX_CACHE_ENTRIES = 1000; // Límite de imágenes en caché
  private static readonly DB_NAME = 'image-cache';
  private static readonly STORE_NAME = 'images';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Establecer la imagen de placeholder por defecto
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholderImage);
    this.initObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && !changes['imageUrl'].isFirstChange()) {
      this.initObserver();
    }
  }

  private initObserver(): void {
    if (!this.imageUrl) {
      console.warn('No se proporcionó una URL de imagen válida.');
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log(`Cargando imagen: ${this.imageUrl}`);
        this.loadCachedImage();
        this.observer?.unobserve(this.el.nativeElement);
      }
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    this.observer.observe(this.el.nativeElement);
  }

  private async loadCachedImage(): Promise<void> {
    const db = await this.getDB();
    const cachedImage = await db.get(LazyLoadDirective.STORE_NAME, this.imageUrl);

    if (cachedImage) {
      console.log(`Imagen encontrada en caché IndexedDB: ${this.imageUrl}`);
      this.renderer.setAttribute(this.el.nativeElement, 'src', cachedImage.base64);
    } else {
      console.log(`Imagen no encontrada en caché, descargando: ${this.imageUrl}`);
      await this.manageCacheSize(db);
      await this.downloadAndCacheImage(db);
    }
  }

  private async downloadAndCacheImage(db: any): Promise<void> {
    try {
      const response = await fetch(this.imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`Error al cargar la imagen: ${response.status}`);

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result?.toString();
        if (base64data) {
          console.log(`Imagen almacenada en IndexedDB: ${this.imageUrl}`);
          await db.put(LazyLoadDirective.STORE_NAME, { url: this.imageUrl, base64: base64data, timestamp: Date.now() });
          this.renderer.setAttribute(this.el.nativeElement, 'src', base64data);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error descargando o almacenando la imagen:', error);
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholderImage);
    }
  }

  private async manageCacheSize(db: any): Promise<void> {
    const items = await db.getAllKeys(LazyLoadDirective.STORE_NAME);

    if (items.length >= LazyLoadDirective.MAX_CACHE_ENTRIES) {
      console.warn(`Límite de caché alcanzado (${LazyLoadDirective.MAX_CACHE_ENTRIES}). Eliminando elementos más antiguos...`);

      const oldest = await db.getAll(LazyLoadDirective.STORE_NAME);
      oldest.sort((a: { timestamp: number; }, b: { timestamp: number; }) => a.timestamp - b.timestamp);

      await db.delete(LazyLoadDirective.STORE_NAME, oldest[0].url);
      console.log(`Imagen eliminada de IndexedDB: ${oldest[0].url}`);
    }
  }

  private async getDB() {
    return await openDB(LazyLoadDirective.DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(LazyLoadDirective.STORE_NAME)) {
          db.createObjectStore(LazyLoadDirective.STORE_NAME, { keyPath: 'url' });
        }
      }
    });
  }
}
