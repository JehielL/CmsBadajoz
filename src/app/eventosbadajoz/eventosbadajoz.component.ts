import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos'; 



@Component({
  selector: 'app-eventosbadajoz',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './eventosbadajoz.component.html',
  styleUrl: './eventosbadajoz.component.css'
})
export class EventosbadajozComponent implements OnInit {

  activedLoader = true;
    eventos: EventosBadajoz[] = []; // Datos obtenidos de la API
    authService: AuthenticationService | undefined;

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
  
      AOS.init({
        duration: 1500,
        offset: 200,
        once: true,
      });
  
      window.scrollTo(0, 0);
  
      // Realizar la solicitud a la API sin necesidad de id
      const url = '/assets/eventos.json';  // URL de la API
  
      console.log('Realizando solicitud a la URL:', url);
  
      this.httpClient.get<EventosBadajoz[]>(url).subscribe({
        next: eventos => {
          console.log('Rutas recibidas:', eventos);
          this.eventos = eventos;
        },
        error: err => {
          console.error('Error al obtener los eventos:', err);
          console.error('Estado HTTP:', err.status);
          console.error('Mensaje de error:', err.message);
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
