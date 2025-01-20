import { Component } from '@angular/core';
import { Empresa } from '../interfaces/empresas.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';
import { LazyLoadDirective } from '../lazy-load.directive';

@Component({
  selector: 'app-empresas-detail',
  standalone: true,
  imports: [HttpClientModule, LazyLoadDirective],
  templateUrl: './empresas-detail.component.html',
  styleUrl: './empresas-detail.component.css'
})
export class EmpresasDetailComponent {

  private map: any;
  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg';
  private mapInitialized = false;
  
    empresa: Empresa | undefined;
  
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient
    ) { }
  
    ngOnInit(): void {
      const identifier = this.route.snapshot.paramMap.get('id');
  
      if (identifier) {
        const url = `/assets/response_empresas.json`; // URL a tu JSON
        this.http.get<Empresa[]>(url).subscribe({
          next: empresas => {
            this.empresa = empresas.find(empresa => empresa.identifier.toString() === identifier);
          },
          error: err => {
            console.error('Error al cargar los detalles de empresa:', err);
          }
        });
      }
    }

     ngAfterViewChecked(): void {
        if (this.empresa && this.empresa.latitude && this.empresa.longitude && !this.mapInitialized) {
          this.initMap(this.empresa.latitude, this.empresa.longitude);
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
        if (this.empresa?.name) {
          L.marker([latitude, longitude]).addTo(this.map)
            .openPopup();
        }
      }
}
