import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarouselModule, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as AOS from 'aos';
import { User } from '../interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Evento } from '../interfaces/eventos.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [NgbCarouselModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']  // Aquí se debe usar styleUrls en plural
})
export class EventosComponent implements OnInit {

  
  
  user: User | undefined;
  userId: string | null = null;
  isAdmin: boolean = false;
  isLoggedin = false;
  authService: AuthenticationService | undefined;
  evento: Evento | undefined;
  isUpdate: boolean = false;
  users: User[] = [];
  eventos: Evento[] = [];
  activedLoader = true;





  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    authService: AuthenticationService  ) {
      this.authService = authService;
      if (this.authService) {
        this.authService.isLoggedin.subscribe(isLoggedin => this.isLoggedin = isLoggedin);
        this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
        this.authService.userId.subscribe(userId => this.userId = userId);
      }
    }




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
  
    this.activatedRoute.params.subscribe(params => {
      window.scrollTo(0, 0); 
  
      const id = params['id'];
      if (!id) return;
  
      // URL del endpoint para obtener los eventos del usuario
      const url = `http://localhost:8080/eventos/filter-by-user/${id}`;
  
      this.httpClient.get<Evento[]>(url).subscribe(
        eventos => {
          console.log('Eventos recibidos:', eventos);
          this.eventos = eventos;
          console.log('Eventos en el frontend:', this.eventos);
        },
        error => {
          console.error('Error al obtener los eventos:', error);
        }
      );
  
      const userUrl = `http://localhost:8080/user/${id}`;
      this.httpClient.get<User[]>(userUrl).subscribe(users => {
        this.users = users;
        console.log('Usuarios recibidos:', this.users);
      });
    });
  
    console.log(this.isAdmin);
  }
  

  carruselIntervalo = 2000;
  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

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
