import { Component, OnInit, ViewChild } from '@angular/core';
import * as AOS from 'aos'; 
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Oferta } from '../interfaces/oferta.model';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit {
  activedLoader = true;
  ofertas: Oferta[] = [];


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
    const url = '/assets/oferta.json';  // URL de la API

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Oferta[]>(url).subscribe({
      next: ofertas => {
        console.log('Rutas recibidas:', ofertas);
        this.ofertas = ofertas;
      },
      error: err => {
        console.error('Error al obtener los eventos:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }

  carruselIntervalo = 2000;
  images = [6, 3, 46, 95, 92, 43, 38].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}
