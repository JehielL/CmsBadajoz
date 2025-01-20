import { Component, OnInit } from '@angular/core';
import { Ruta } from '../interfaces/ruta.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LazyLoadDirective } from '../lazy-load.directive'; 


@Component({
  selector: 'app-ruta-detail',
  standalone: true,
  imports: [HttpClientModule, LazyLoadDirective],
  templateUrl: './ruta-detail.component.html',
  styleUrl: './ruta-detail.component.css'
})
export class RutaDetailComponent implements OnInit {
  
  ruta: Ruta | undefined;
  placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg';

  
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient
    ) {}
  
    ngOnInit(): void {
      const identifier = this.route.snapshot.paramMap.get('id');
  
      if (identifier) {
        const url = `/assets/response_ruta.json`; // URL a tu JSON
        this.http.get<Ruta[]>(url).subscribe({
          next: rutas => {
            this.ruta = rutas.find(ruta => ruta.identifier.toString() === identifier);
          },
          error: err => {
            console.error('Error al cargar los detalles de RUTA:', err);
          }
        });
      }
    }
}
