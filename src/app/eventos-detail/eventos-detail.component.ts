import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-eventos-detail',
  standalone: true,
  imports: [HttpClientModule, DatePipe],
  templateUrl: './eventos-detail.component.html',
  styleUrl: './eventos-detail.component.css'
})
export class EventosDetailComponent implements OnInit {

  private map: any;
  private mapInitialized = false;
  evento: EventosBadajoz | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('id');

    if (identifier) {
      const url = `/assets/response_evento.json`; // URL a tu JSON
      this.http.get<EventosBadajoz[]>(url).subscribe({
        next: eventos => {
          this.evento = eventos.find(evento => evento.identifier.toString() === identifier);
        },
        error: err => {
          console.error('Error al cargar los detalles de evento:', err);
        }
      });
    }
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

    // Inicializa el mapa en las coordenadas especificadas
    this.map = L.map(mapContainer).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 60,
    }).addTo(this.map);

    // Agrega un marcador al mapa
    if (this.evento?.name) {
      L.marker([latitude, longitude]).addTo(this.map)
        .openPopup();
    }
  }
}
