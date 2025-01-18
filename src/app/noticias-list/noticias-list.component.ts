import { Component, HostListener, OnInit } from '@angular/core';
import { Noticia } from '../interfaces/noticia.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LazyLoadDirective } from '../lazy-load.directive'; // Importa la directiva


@Component({
  selector: 'app-noticias-list',
  standalone: true,
  imports: [HttpClientModule, LazyLoadDirective],
  templateUrl: './noticias-list.component.html',
  styleUrl: './noticias-list.component.css'
})
export class NoticiasListComponent implements OnInit {


  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg'; // Ruta a una imagen de reemplazo

  activedLoader = true;
  noticias: Noticia[] = [];
  displayedEvento: Noticia[] = [];
  authService: AuthenticationService | undefined;
  currentEvento: Noticia | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: Noticia[] = [];
  puedeMostrarMas: boolean = true;
  itemsPorPagina: number = 4;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    authService: AuthenticationService,

  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    window.scrollTo(0, 0);

    const url = '/assets/response_noticia.json';


    this.httpClient.get<Noticia[]>(url).subscribe({
      next: noticias => {
        this.noticias = noticias.map(noticia => ({
          ...noticia,
          name: noticia.name,
          identifier: noticia.identifier,
          image: noticia.image,
        }));
        this.noticias = noticias.reverse();

        this.loadMoreItems();
      },
      error: err => {
        console.error('Error al obtener los eventos:', err);
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
    if (this.isLoading || this.displayedEvento.length >= this.noticias.length) return;

    this.isLoading = true;

    // Usa un timer para simular retardo si necesitas demostrar la carga progresiva
    setTimeout(() => {
      const start = this.displayedEvento.length;
      const end = Math.min(start + this.itemsPorPagina, this.noticias.length);
      this.displayedEvento = [...this.displayedEvento, ...this.noticias.slice(start, end)];

      this.isLoading = false;
      this.puedeMostrarMas = this.displayedEvento.length < this.noticias.length;
    }, 500);
  }


  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.noticias.filter(noticia =>
        noticia.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  rutaTrack(index: number, item: Noticia) {
    return item.identifier; // O alguna otra propiedad única
  }

  verDetalle(identifier: string): void {
    console.log(`Redirigiendo al detalle de evento con identificador: ${identifier}`);
    this.router.navigate(['/detalle-noticia', identifier]);
  }
}
