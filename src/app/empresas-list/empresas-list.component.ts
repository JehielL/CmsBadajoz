import { Component, HostListener, OnInit } from '@angular/core';
import { Empresa } from '../interfaces/empresas.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LazyLoadDirective } from '../lazy-load.directive'; // Importa la directiva


@Component({
  selector: 'app-empresas-list',
  standalone: true,
  imports: [HttpClientModule, LazyLoadDirective],
  templateUrl: './empresas-list.component.html',
  styleUrl: './empresas-list.component.css'
})
export class EmpresasListComponent implements OnInit {


  activedLoader = true;
  empresas: Empresa[] = [];
  displayedEmpresa: Empresa[] = [];
  authService: AuthenticationService | undefined;
  currentEvento: Empresa | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: Empresa[] = [];
  puedeMostrarMas: boolean = true;
  itemsPorPagina: number = 6;
  isLoading: boolean = false;
  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg'; // Ruta a una imagen de reemplazo


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    authService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    console.log("Componente RutasList iniciado");

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    window.scrollTo(0, 0);

    const url = '/assets/response_empresas.json';

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Empresa[]>(url).subscribe({
      next: empresas => {
        this.empresas = empresas.map(evento => ({
          ...evento,
          name: evento.name,
          identifier: evento.identifier,
          image: evento.image,
        }));

        this.loadMoreItems();
      },
      error: err => {
        console.error('Error al obtener:', err);
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
    if (this.isLoading || this.displayedEmpresa.length >= this.empresas.length) return;

    this.isLoading = true;

    // Usa un timer para simular retardo si necesitas demostrar la carga progresiva
    setTimeout(() => {
      const start = this.displayedEmpresa.length;
      const end = Math.min(start + this.itemsPorPagina, this.empresas.length);
      this.displayedEmpresa = [...this.displayedEmpresa, ...this.empresas.slice(start, end)];

      this.isLoading = false;
      this.puedeMostrarMas = this.displayedEmpresa.length < this.empresas.length;
    }, 500);
  }


  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.empresas.filter(empresa =>
        empresa.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  rutaTrack(index: number, item: Empresa) {
    return item.identifier; // O alguna otra propiedad única
  }

  verDetalle(identifier: string): void {
    console.log(`Redirigiendo al detalle de empresa con identificador: ${identifier}`);
    this.router.navigate(['/detalle-empresa', identifier]);
  }
}
