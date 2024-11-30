import { Component, OnInit, ViewChild } from '@angular/core';
import * as AOS from 'aos'; 
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Noticia } from '../interfaces/noticia.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {

  noticias: Noticia[] = [];

  activedLoader = true;

  constructor(
    private activedRoute : ActivatedRoute,
    private router: Router,
    private  httpClient: HttpClient,
    authService: AuthenticationService
  ){}
  ngOnInit(): void {

    AOS.init({
      duration: 1500, 
      offset: 200,   
      once: true,
    });
    
    setTimeout(() => {
      this.activedLoader = false;
    }, 1100); 
    window.scrollTo(0, 0); 

    const url = '/assets/response_noticia.json';

    this.httpClient.get<Noticia[]>(url).subscribe({
      next: noticias => {
        
        console.log('Noticias recibidas:', noticias);
        this.noticias = noticias;
      }, error: err => {
        console.error('Error al obtener las noticias:', err);
        console.error('Estado HTTP:', err.status);
        console.error('Mensaje de error:', err.message);
      }
    })
    
  }

  carruselIntervalo = 2000;

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
