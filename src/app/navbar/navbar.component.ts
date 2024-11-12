import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOnline: boolean = navigator.onLine; 
  private isComponentActive: boolean = true; 

  ngOnInit(): void {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    this.checkConnectionStatus();
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
}