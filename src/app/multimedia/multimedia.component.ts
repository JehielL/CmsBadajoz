  import { Component, OnInit, ViewChild } from '@angular/core';
  import * as AOS from 'aos'; 
  import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
  import { FormsModule } from '@angular/forms';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { Multimedia } from '../interfaces/multimedia.model';
  import { AuthenticationService } from '../services/authentication.service';
  import { ActivatedRoute, Router } from '@angular/router';
  import { LazyLoadDirective } from '../lazy-load.directive'; 

  

  @Component({
    selector: 'app-multimedia',
    standalone: true,
    imports: [NgbCarouselModule, FormsModule, HttpClientModule, LazyLoadDirective],
    templateUrl: './multimedia.component.html',
    styleUrl: './multimedia.component.css'
  })
  export class MultimediaComponent implements OnInit {
    activedLoader = true;
    pois: Multimedia[] = []; // Datos obtenidos de la API
    authService: AuthenticationService | undefined;
    currentPois: Multimedia | undefined; // El POI que se está mostrando actualmente en el carrusel
    placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-1024x1024.jpg';

    @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private httpClient: HttpClient,
      authService: AuthenticationService
    ) {}

    ngOnInit(): void {
      console.log("Componente Rutas iniciado");
    
      setTimeout(() => {
        this.activedLoader = false;
      }, 1100);
    
      
      window.scrollTo(0, 0);
    
      const url = '/assets/response_poi.json';  
    
      console.log('Realizando solicitud a la URL:', url);
    
      this.httpClient.get<Multimedia[]>(url).subscribe({
        next: pois => {
          console.log('Rutas recibidas:', pois);
    
          this.pois = pois.slice(1).filter(poi => poi.image && poi.image.trim() !== '');
    
          if (this.pois.length > 0) {
            this.loadPoi(0); 
          } else {
            console.warn('No hay POIs válidos para mostrar.');
          }
        },
        error: err => {
          console.error('Error al obtener los eventos:', err);
          console.error('Estado HTTP:', err.status);
          console.error('Mensaje de error:', err.message);
        }
      });
    }
    
    

    isPaused = false;

    loadPoi(index: number): void {
      if (this.pois[index]) {
        this.currentPois = this.pois[index];
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
      this.loadPoi(index);
    }
  }