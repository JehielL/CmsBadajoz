import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Añade CommonModule aquí
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOnline: boolean = navigator.onLine; 
  private isComponentActive: boolean = true; 
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Badajoz,es&units=metric&appid=0e6ce57310874f46f331260d9dd56718`;
  weather: any;
  currentDate: Date = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    this.checkConnectionStatus();
    this.getWeather();

    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
    this.isComponentActive = false; 
  }

  private updateOnlineStatus = () => {
    this.isOnline = navigator.onLine;
    console.log('Estado de conexión actualizado por evento:', this.isOnline ? 'Online' : 'Offline');
  };

  private checkConnectionStatus = async () => {
    if (!this.isComponentActive) return;

    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      this.isOnline = response.ok || navigator.onLine;
    } catch (error) {
      this.isOnline = false;
    }
    console.log('Estado de conexión verificado manualmente:', this.isOnline ? 'Online' : 'Offline');

    if (this.isComponentActive) {
      setTimeout(this.checkConnectionStatus, 10000);
    }
  };

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