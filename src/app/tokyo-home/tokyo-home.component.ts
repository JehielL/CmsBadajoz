import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common'; 
import localeEs from '@angular/common/locales/es'; 
import { FormsModule } from '@angular/forms';
import { VolumeButtons, VolumeButtonsResult } from '@capacitor-community/volume-buttons';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tokyo-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, DatePipe, FormsModule],
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
  audioElement: HTMLAudioElement = new Audio();
  volume: number = 50;  // Inicializa el volumen en 50% (solo visual)

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    private http: HttpClient
  ) {
    registerLocaleData(localeEs, 'es'); // Registra el idioma español
    if (this.authService) {
      this.authService.isLoggedin.subscribe(isLoggedin => {
        this.isLoggedin = isLoggedin;
        console.log('Estado de sesión:', this.isLoggedin);
      });
      this.authService.isAdmin.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        console.log('Es administrador:', this.isAdmin);
      });
      this.authService.userId.subscribe(userId => {
        this.userId = userId;
        console.log('User ID:', this.userId);
      });
    }
  }

  ngOnInit(): void {
   
    console.log('Iniciando observación de volumen...');
    this.watchDeviceVolume();
    
    console.log('Obteniendo información del clima...');
    this.getWeather();

    setInterval(() => {
      this.currentDate = new Date();
      this.isDayTime = this.currentDate.getHours() >= 6 && this.currentDate.getHours() < 18;
    }, 1000);
    
    setTimeout(() => {
      this.activedLoader = false;
      console.log('Loader desactivado');
    }, 1100); 
    window.scrollTo(0, 0); 
  }

  /**
   * Observa los cambios en los botones de volumen del dispositivo.
   */
  async watchDeviceVolume() {
    try {
      await VolumeButtons.watchVolume({}, (result: VolumeButtonsResult | null) => {
        console.log('Evento de volumen detectado:', result);
  
        if (result && result.direction) {
          if (result.direction === 'up') {
            this.volume = Math.min(this.volume + 5, 100);
          } else if (result.direction === 'down') {
            this.volume = Math.max(this.volume - 5, 0);
          }
          console.log(`Cambio de volumen detectado: ${this.volume}%`);
        } else {
          console.warn('El resultado del evento es null o no tiene la propiedad esperada:', result);
        }
      });
    } catch (error) {
      console.error('Error al observar los cambios de volumen:', error);
    }
  }
  
  

  getWeather(): void {
    this.http.get(this.apiUrl).subscribe({
      next: data => {
        this.weather = data;
        console.log('Datos del clima obtenidos:', this.weather);
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
