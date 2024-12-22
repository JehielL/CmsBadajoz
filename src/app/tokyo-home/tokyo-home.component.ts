import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as AOS from 'aos'; 
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common'; // Importa registerLocaleData
import localeEs from '@angular/common/locales/es'; // Importa el idioma español

@Component({
  selector: 'app-tokyo-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, DatePipe],
  templateUrl: './tokyo-home.component.html',
  styleUrl: './tokyo-home.component.css'
})
export class TokyoHomeComponent implements OnInit {
  collapsed = true;
  userId: string | null = null;
  isAdmin = false;
  isLoggedin = false;
  user: User | undefined;
  
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Badajoz,es&units=metric&appid=0e6ce57310874f46f331260d9dd56718`;
  weather: any;
  currentDate: Date = new Date();
  isDayTime: boolean | undefined;
  activedLoader = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    private http: HttpClient
  ) {
    registerLocaleData(localeEs, 'es'); // Registra el idioma español
    if (this.authService) {
      this.authService.isLoggedin.subscribe(isLoggedin => this.isLoggedin = isLoggedin);
      this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
      this.authService.userId.subscribe(userId => this.userId = userId);
      this.authService.avatarUrl.subscribe(avatarUrl => {
        if (this.user) {
          this.user.imgUser = avatarUrl;
        }
      });
    }
  }

  getUserAvatar() {
    if (this.user) {
      return this.user.imgUser;
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    AOS.init({
      duration: 1500, 
      offset: 200,   
      once: true,
    });

    this.getWeather();

    setInterval(() => {
      this.currentDate = new Date();
      this.isDayTime = this.currentDate.getHours() >= 6 && this.currentDate.getHours() < 18;
    }, 1000);
    
    setTimeout(() => {
      this.activedLoader = false;
    }, 1100); 
    window.scrollTo(0, 0); 
  }

  getWeather(): void {
    this.http.get(this.apiUrl).subscribe({
      next: data => {
        this.weather = data;
      },
      error: err => {
        console.error('Error al obtener el clima:', err);
        if (err.status === 401) {
          console.error('API Key inválida. Por favor verifica tu API Key.');
        }
      }
    });
  }
}