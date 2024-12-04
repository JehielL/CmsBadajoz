import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../interfaces/empresas.model';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import * as AOS from 'aos';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit{
  
  empresas: Empresa[] = [];
  activedLoader = true;
  currentEmpresa: Empresa | undefined;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
   
  }
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
  
   
    const url = '/assets/response_empresas.json';  
  
    console.log('Realizando solicitud a la URL:', url);
  
    this.httpClient.get<Empresa[]>(url).subscribe({
      next: empresas => {
        // Ordenar eventos por fecha en orden descendente
        console.log('Eventos en el frontend:', this.empresas);
        this.empresas = empresas;

        this.loadEmpresa(0);
        
      },
      error: err => {
        console.error('Error al obtener las empresas:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }
  
  
  generateMapUrl(latitude: number, longitude: number): string {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  }

  loadEmpresa(index: number): void {
    if (this.empresas[index]) {
      this.currentEmpresa = this.empresas[index];
    }
  }
  
  
  onCarouselSlideChanged(event: any): void {
    const index = event.current;
    this.loadEmpresa(index);  // Cargar la ruta correspondiente al índice de la diapositiva
  }
  

}
