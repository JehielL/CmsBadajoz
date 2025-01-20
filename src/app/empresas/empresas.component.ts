import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../interfaces/empresas.model';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from '../services/cache.service';
import { LazyLoadDirective } from '../lazy-load.directive';

import * as AOS from 'aos';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule, LazyLoadDirective],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  displayedEmpresas: Empresa[] = [];
  activedLoader = true;
  currentEmpresa: Empresa | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: Empresa[] = [];
  puedeMostrarMas: boolean = true;
  itemsPorPagina: number = 6;
  isLoading: boolean = false;
  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg';

  private scrollTimeout: any;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    console.log("Componente Empresas iniciado");

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    window.scrollTo(0, 0);

    const url = '/assets/response_empresas.json';

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Empresa[]>(url).subscribe({
      next: async empresas => {
        this.empresas = empresas.filter(empresa => empresa.image && empresa.image.trim() !== '');

        

        this.loadMoreItems();
      },
      error: err => {
        console.error('Error al obtener las empresas:', err);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoading) return;

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const scrollPos = window.scrollY + window.innerHeight;
      if (scrollPos >= document.documentElement.offsetHeight - 50) {
        this.loadMoreItems();
      }
    }, 200);
  }

  loadMoreItems(): void {
    if (this.isLoading || this.displayedEmpresas.length >= this.empresas.length) return;

    this.isLoading = true;

    setTimeout(() => {
      const start = this.displayedEmpresas.length;
      const end = Math.min(start + this.itemsPorPagina, this.empresas.length);

      this.displayedEmpresas = [
        ...this.displayedEmpresas,
        ...this.empresas.slice(start, end).map(empresa => ({
          ...empresa,
          image: empresa.image || this.placeholderImage
        }))
      ];

      this.isLoading = false;
      this.puedeMostrarMas = this.displayedEmpresas.length < this.empresas.length;
    }, 500);
  }

  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.empresas.filter(empresa =>
          empresa.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
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

  loadEmpresa(index: number): void {
    if (this.empresas[index]) {
      this.currentEmpresa = this.empresas[index];
    }
  }

  onCarouselSlideChanged(event: any): void {
    const index = event.current;
    this.loadEmpresa(index);
  }

  verDetalle(identifier: string): void {
    console.log(`Redirigiendo al detalle de la empresa con identificador: ${identifier}`);
    this.router.navigate(['/detalle-empresa', identifier]);
  }

  generateMapUrl(latitude: number, longitude: number): string {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  }
}
