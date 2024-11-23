  import { Component, OnInit, ViewChild } from '@angular/core';
  import * as AOS from 'aos'; 
  import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
  import { FormsModule } from '@angular/forms';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { Multimedia } from '../interfaces/multimedia.model';
  import { AuthenticationService } from '../services/authentication.service';
  import { ActivatedRoute, Router } from '@angular/router';

  @Component({
    selector: 'app-multimedia',
    standalone: true,
    imports: [NgbCarouselModule, FormsModule, HttpClientModule],
    templateUrl: './multimedia.component.html',
    styleUrl: './multimedia.component.css'
  })
  export class MultimediaComponent implements OnInit {
    activedLoader = true;
    pois: Multimedia[] = []; // Datos obtenidos de la API
    authService: AuthenticationService | undefined;

    @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private httpClient: HttpClient,
      authService: AuthenticationService
    ) {}

    ngOnInit(): void {
      console.log("Componente Multimedia iniciado");
    
      
    
      setTimeout(() => {
        this.activedLoader = false;
        console.log("Loader desactivado");
      }, 1100);
    
      window.scrollTo(0, 0);
    
      const url = '/assets/badajoz.json';
      console.log('Realizando solicitud a la URL:', url);
    
      this.httpClient.get<Multimedia[]>(url).subscribe({
        next: (eventos) => {
          console.log('Eventos recibidos:', eventos);
          this.pois = eventos;
        },
        error: (err) => {
          console.error('Error al obtener los eventos:', err);
        }
      });
    }
    

    isPaused = false;

    togglePaused(): void {
      if (this.isPaused) {
        this.carousel.cycle();
      } else {
        this.carousel.pause();
      }
      this.isPaused = !this.isPaused;
    }
  }