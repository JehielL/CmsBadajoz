import { Component, HostListener, OnInit } from '@angular/core';
import { Ruta } from '../interfaces/ruta.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-rutas-list',
  standalone: true,
  imports: [HttpClientModule, ScrollingModule],
  templateUrl: './rutas-list.component.html',
  styleUrl: './rutas-list.component.css'
})
export class RutasListComponent implements OnInit {

  activedLoader = true;
  rutas: Ruta[] = [];
  displayedRutas: Ruta[] = [];
  authService: AuthenticationService | undefined;
  currentRuta: Ruta | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: Ruta[] = [];
  puedeMostrarMas: boolean = true;
  itemsPorPagina: number = 6;
  isLoading: boolean = false;

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

    const url = '/assets/response_ruta.json';

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Ruta[]>(url).subscribe({
      next: rutas => {
        this.rutas = rutas.map(ruta => ({
          ...ruta,
          name: ruta.name,
          identifier: ruta.identifier,
          image: ruta.image,
        }));
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
    if (this.isLoading || this.displayedRutas.length >= this.rutas.length) return;

    this.isLoading = true;

    // Usa un timer para simular retardo si necesitas demostrar la carga progresiva
    setTimeout(() => {
      const start = this.displayedRutas.length;
      const end = Math.min(start + this.itemsPorPagina, this.rutas.length);
      this.displayedRutas = [...this.displayedRutas, ...this.rutas.slice(start, end)];

      this.isLoading = false;
      this.puedeMostrarMas = this.displayedRutas.length < this.rutas.length;
    }, 500); 
  }


  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.rutas.filter(ruta =>
        ruta.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  rutaTrack(index: number, item: Ruta) {
      return item.identifier; // O alguna otra propiedad única
    }

    verDetalle(identifier: string): void {
      console.log(`Redirigiendo al detalle de ruta con identificador: ${identifier}`);
      this.router.navigate(['/detalle-ruta', identifier]);
    } 
}
