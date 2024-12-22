import { Component, HostListener, OnInit } from '@angular/core';
import { Multimedia } from '../interfaces/multimedia.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as AOS from 'aos'; 
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
  ) {}

  ngOnInit(): void {
    console.log("Componente PoiList iniciado");

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    AOS.init({
      duration: 1500,
      offset: 200,
      once: true,
    });

    window.scrollTo(0, 0);

    const url = '/assets/response_poi.json'; 

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Multimedia[]>(url).subscribe({
      next: pois => {
        console.log('POIs recibidos:', pois);
        this.pois = pois;
        this.loadMoreItems();
      },
      error: err => {
        console.error('Error al obtener los POIs:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPos = window.scrollY + window.innerHeight;
    const offsetHeight = document.documentElement.offsetHeight;

    // Ajusta 50px de margen antes de llegar al final
    if (scrollPos >= offsetHeight - 50 && !this.isLoading) {
      this.loadMoreItems();
    }
  }

  loadMoreItems(): void {
    if (this.isLoading || this.displayedPois.length >= this.pois.length) return;
    this.isLoading = true;

    const start = this.displayedPois.length;
    const end = Math.min(start + this.itemsPorPagina, this.pois.length); // Asegura que no se exceda el límite
    const nextItems = this.pois.slice(start, end);
    this.displayedPois = [...this.displayedPois, ...nextItems];

    this.isLoading = false;
    this.puedeMostrarMas = this.displayedPois.length < this.pois.length;
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
}