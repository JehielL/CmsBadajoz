import { Component, HostListener, OnInit } from '@angular/core';
import { Multimedia } from '../interfaces/multimedia.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [HttpClientModule, ScrollingModule],
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
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
        // Reducir los datos si contienen propiedades irrelevantes
        this.pois = pois.map(poi => ({
          ...poi,
          name: poi.name,
          identifier: poi.identifier,
          image: poi.image, // Solo las propiedades necesarias
        }));
        this.loadMoreItems();
      },
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

    // Usa un timer para simular retardo si necesitas demostrar la carga progresiva
    setTimeout(() => {
      const start = this.displayedPois.length;
      const end = Math.min(start + this.itemsPorPagina, this.pois.length);
      this.displayedPois = [...this.displayedPois, ...this.pois.slice(start, end)];

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