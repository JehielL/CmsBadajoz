import { Component, OnInit, ViewChild } from '@angular/core';
import * as AOS from 'aos';
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Ruta } from '../interfaces/ruta.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent implements OnInit {
  activedLoader = true;
  rutas: Ruta[] = [];  // Almacena todas las rutas que recibes del JSON
  currentRuta: Ruta | undefined;  // La ruta que se está mostrando actualmente en el carrusel
  authService: AuthenticationService | undefined;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
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

    // Realizar la solicitud a la API usando el proxy
    const url = '/assets/response_ruta.json';  // URL de la API

    console.log('Realizando solicitud a la URL:', url);

    this.httpClient.get<Ruta[]>(url).subscribe({
      next: rutas => {
        console.log('Rutas recibidas:', rutas);
        this.rutas = rutas;
        this.loadRuta(0);
      },
      error: err => {
        console.error('Error al obtener los eventos:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    });
  }

  // Método para cargar una ruta específica por su índice
  loadRuta(index: number): void {
    if (this.rutas[index]) {
      this.currentRuta = this.rutas[index];
    }
  }

  trackByRuta(index: number, ruta: Ruta): number {
    return ruta.identifier;
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

  // Escuchar el cambio de diapositiva para cargar la ruta correspondiente
  onCarouselSlideChanged(event: any): void {
    const index = event.current;
    this.loadRuta(index);  // Cargar la ruta correspondiente al índice de la diapositiva
  }
}