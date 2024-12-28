import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Multimedia } from '../interfaces/multimedia.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-poi-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './poi-detail.component.html',
  styleUrls: ['./poi-detail.component.css']
})
export class PoiDetailComponent implements OnInit, AfterViewChecked {
  poi: Multimedia | undefined;
  private map: any;
  private mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('id');

    if (identifier) {
      const url = `/assets/response_poi.json`; // URL al JSON local
      this.http.get<Multimedia[]>(url).subscribe({
        next: pois => {
          this.poi = pois.find(poi => poi.identifier.toString() === identifier);
          if (!this.poi) {
            console.error('POI no encontrado');
          }
        },
        error: err => {
          console.error('Error al cargar los detalles del POI:', err);
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.poi && this.poi.latitude && this.poi.longitude && !this.mapInitialized) {
      this.initMap(this.poi.latitude, this.poi.longitude);
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
    if (this.poi?.name) {
      L.marker([latitude, longitude]).addTo(this.map)
        .openPopup();
    }
  }
}