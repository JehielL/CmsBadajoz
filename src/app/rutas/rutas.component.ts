import { Component, OnInit, ViewChild } from '@angular/core';
import * as AOS from 'aos'; 
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Ruta } from '../interfaces/ruta.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './rutas.component.html',
  styleUrl: './rutas.component.css'
})
export class RutasComponent implements OnInit {
  activedLoader = true;
  rutas: Ruta[] = [];
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
    const url = '/assets/response_ruta.json';  // URL de la API

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Ruta[]>(url).subscribe({
      next: rutas => {
        console.log('Rutas recibidas:', rutas);
        this.rutas = rutas;
      },
      error: err => {
        console.error('Error al obtener los eventos:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }

  trackByRuta(index: number, ruta: Ruta): number {
    return ruta['id'];
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
