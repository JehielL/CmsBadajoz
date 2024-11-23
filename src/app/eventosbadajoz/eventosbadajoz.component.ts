import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';import { SecurityContext } from '@angular/core';



@Component({
  selector: 'app-eventosbadajoz',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './eventosbadajoz.component.html',
  styleUrl: './eventosbadajoz.component.css'
})
export class EventosbadajozComponent implements OnInit {

  activedLoader = true;
  eventosB: EventosBadajoz[] = [];
  authService: AuthenticationService | undefined;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor(
    private activedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,  // Inyectar DomSanitizer
    authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    const url = '/assets/eventos.json';

    this.httpClient.get<any[]>(url).subscribe({
  next: eventosB => {
    console.log('Datos recibidos:', eventosB);  // Añadir esta línea para ver la respuesta
    this.eventosB = eventosB.map(evento => ({
      ...evento,
      description: this.sanitizer.bypassSecurityTrustHtml(evento.description),
      image: evento.image ? this.sanitizer.sanitize(SecurityContext.URL, evento.image) || undefined : undefined
    }));
    this.activedLoader = false; 
  },
  error: err => {
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
