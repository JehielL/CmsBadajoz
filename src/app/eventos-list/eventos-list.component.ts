import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './eventos-list.component.html',
  styleUrl: './eventos-list.component.css'
})
export class EventosListComponent implements OnInit {


  activedLoader = true;
  eventos: EventosBadajoz[] = [];
  displayedEvento: EventosBadajoz[] = [];
  authService: AuthenticationService | undefined;
  currentEvento: EventosBadajoz | undefined;
  searchTerm: string = '';
  maxResultados: number = 20;
  minResultados: number = 0;
  resultadosBusqueda: EventosBadajoz[] = [];
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

    const url = '/assets/response_evento.json';

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<EventosBadajoz[]>(url).subscribe({
      next: eventos => {
        this.eventos = eventos.map(evento => ({
          ...evento,
          name: evento.name,
          identifier: evento.identifier,
          image: evento.image,
        }));
        this.eventos = eventos.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

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
    if (this.isLoading || this.displayedEvento.length >= this.eventos.length) return;

    this.isLoading = true;

    // Usa un timer para simular retardo si necesitas demostrar la carga progresiva
    setTimeout(() => {
      const start = this.displayedEvento.length;
      const end = Math.min(start + this.itemsPorPagina, this.eventos.length);
      this.displayedEvento = [...this.displayedEvento, ...this.eventos.slice(start, end)];

      this.isLoading = false;
      this.puedeMostrarMas = this.displayedEvento.length < this.eventos.length;
    }, 500);
  }


  filtrarResultados(): void {
    const resultadosFiltrados = this.searchTerm
      ? this.eventos.filter(evento =>
        evento.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  rutaTrack(index: number, item: EventosBadajoz) {
    return item.identifier; // O alguna otra propiedad única
  }

  verDetalle(identifier: string): void {
    console.log(`Redirigiendo al detalle de evento con identificador: ${identifier}`);
    this.router.navigate(['/detalle-evento', identifier]);
  }

}
