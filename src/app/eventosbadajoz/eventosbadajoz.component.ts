import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as L from 'leaflet';

@Component({
  selector: 'app-eventosbadajoz',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule, DatePipe],
  templateUrl: './eventosbadajoz.component.html',
  styleUrls: ['./eventosbadajoz.component.css']
})
export class EventosbadajozComponent implements OnInit, AfterViewChecked {

  activedLoader = true;
  eventos: EventosBadajoz[] = [];
  evento: EventosBadajoz | undefined;
  private map: any;
  private mapInitialized = false;
  currentEvento: EventosBadajoz | undefined;
  authService: AuthenticationService | undefined;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log("Componente Rutas iniciado");

    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);

    AOS.init({
      duration: 1500,
      offset: 200,
      once: true,
    });

    window.scrollTo(0, 0);

    // Realizar la solicitud a la API sin necesidad de id
    const url = '/assets/response_evento.json';  // URL de la API

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<EventosBadajoz[]>(url).subscribe({
      next: eventos => {
        console.log('Rutas recibidas:', eventos);
        this.eventos = eventos.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        this.loadRuta(0);
      },
      error: err => {
        console.error('Error al obtener los eventos:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }

  isPaused = false;
  loadRuta(index: number): void {
    if (this.eventos[index]) {
      this.currentEvento = this.eventos[index];
      this.evento = this.eventos[index];
      this.mapInitialized = false; // Reinicia la bandera para permitir la inicialización del mapa
    }
  }

  togglePaused(): void {
    if (this.isPaused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.isPaused = !this.isPaused;
  }

  onCarouselSlideChanged(event: any): void {
    const index = event.current;
    this.loadRuta(index);  // Cargar la ruta correspondiente al índice de la diapositiva
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '../assets/DIPUTACION-BADAJOZ-1024x1024.jpg';
  }

  ngAfterViewChecked(): void {
    if (this.evento && this.evento.latitude && this.evento.longitude && !this.mapInitialized) {
      this.initMap(this.evento.latitude, this.evento.longitude);
      this.mapInitialized = true;
    }
  }

  private initMap(latitude: number, longitude: number): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Contenedor de mapa no encontrado.');
      return;
    }

    if (!this.map) {
      this.map = L.map(mapContainer).setView([latitude, longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
    } else {
      this.map.setView([latitude, longitude], 15);
    }

    L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup(`<b>${this.evento?.name}</b><br>${this.evento?.description || ''}`)
      .openPopup();
  }
}