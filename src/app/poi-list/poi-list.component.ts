import { Component, HostListener, OnInit } from '@angular/core';
import { Multimedia } from '../interfaces/multimedia.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LazyLoadDirective } from '../lazy-load.directive'; 
import { CacheService } from '../services/cache.service';



@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [HttpClientModule, ScrollingModule, LazyLoadDirective],
  templateUrl: './poi-list.component.html',
  styleUrls: ['./poi-list.component.css']
})
export class PoiListComponent implements OnInit {
  activedLoader = true;
  pois: Multimedia[] = [];
  displayedPois: Multimedia[] = [];
  authService: AuthenticationService | undefined;
  currentPois: Multimedia | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: Multimedia[] = [];
  puedeMostrarMas: boolean = true;
  itemsPorPagina: number = 6;
  isLoading: boolean = false;
  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg'; // Ruta a una imagen de reemplazo


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private cacheService: CacheService,
    authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log("Componente PoiList iniciado");

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    window.scrollTo(0, 0);

    const url = '/assets/response_poi.json';

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Multimedia[]>(url).subscribe({
      next: pois => {
        this.pois = pois.map(poi => ({
          ...poi,
          name: poi.name,
          identifier: poi.identifier,
          latitude: poi.latitude,
          longitude: poi.longitude,
          image: poi.image && poi.image.trim() !== '' ? poi.image : this.placeholderImage, 
        }));
        this.loadMoreItems();
      }
      ,
      error: err => {
        console.error('Error al obtener los POIs:', err);
      }
    });

  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoading) return;

    // Usar debounce para evitar llamadas frecuentes
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const scrollPos = window.scrollY + window.innerHeight;
      if (scrollPos >= document.documentElement.offsetHeight - 50) {
        this.loadMoreItems();
      }
    }, 200);
  }
  private scrollTimeout: any;


  loadMoreItems(): void {
    if (this.isLoading || this.displayedPois.length >= this.pois.length) return;
  
    this.isLoading = true;
  
    setTimeout(() => {
      const start = this.displayedPois.length;
      const end = Math.min(start + this.itemsPorPagina, this.pois.length);
  
      this.displayedPois = [
        ...this.displayedPois,
        ...this.pois.slice(start, end).map(poi => ({
          ...poi,
          image: poi.image || this.placeholderImage // Asigna el placeholder si no hay imagen
        }))
      ];
  
      this.isLoading = false;
      this.puedeMostrarMas = this.displayedPois.length < this.pois.length;
    }, 500);
  }
  


  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.pois.filter(poi =>
        poi.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : [];
    this.puedeMostrarMas = resultadosFiltrados.length > this.maxResultados;
    this.resultadosBusqueda = resultadosFiltrados.slice(0, this.maxResultados);
  }

  mostrarMas(): void {
    this.maxResultados += this.itemsPorPagina;
    this.filtrarResultados();
  }

  mostrarMenos(): void {
    this.maxResultados = Math.max(this.minResultados, this.maxResultados - this.itemsPorPagina);
    this.filtrarResultados();
  }

  buscar(termino: string): void {
    this.searchTerm = termino;
    this.filtrarResultados();
  }

  poiTrack(index: number, item: Multimedia) {
    return item.identifier; // O alguna otra propiedad única
  }

  verDetalle(identifier: string): void {
    console.log(`Redirigiendo al detalle del POI con identificador: ${identifier}`);
    this.router.navigate(['/detalle-poi', identifier]);
  }
  
  
}