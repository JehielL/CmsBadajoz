import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { User } from '../interfaces/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { Evento } from '../interfaces/eventos.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {


  collapsed = true;
  photoPreview: string | undefined;
  photoFile: File | undefined;
  isAdmin = false;
  isLoggedin = false;
  userId: string | null = null;
  isUpdate: boolean = false;
  evento: Evento | undefined;
  user: User | undefined;
  users: User[] | undefined;
  eventos: Evento[] | undefined;
  activedLoader = true;
  firstName: string = '';
  userEmail: string = '';



  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) {
    // Subscripción a los cambios de autenticación y admin
    this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
    this.authService.isLoggedin.subscribe(isLoggedin => this.isLoggedin = isLoggedin);
    this.authService.userId.subscribe(userId => this.userId = userId);
    this.authService.firstName.subscribe(firstName => this.firstName = firstName);
    this.authService.userEmail.subscribe(userEmail => this.userEmail = userEmail);
    this.authService.isLoggedin.subscribe(isLoggedin => {
      this.isLoggedin = isLoggedin;
      if (this.isLoggedin) {
        this.httpClient.get<User>('https://desarrollosfutura.com:8444/users/' + this.userId)
          .subscribe(user => {
            this.user = user;
            if (user) {

            } else {
              console.error('No se pudo obtener la información del usuario.');
            }
          });
      }
    });
  }


  ngOnInit(): void {
    // Inicializar animaciones AOS
    AOS.init({
      duration: 1500,
      offset: 200,
      once: true,
    });
    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);
    window.scrollTo(0, 0);



    // Verificar si el `userId` está disponible desde el servicio
    if (this.userId) {
      // Si está disponible, usar el `userId` para cargar eventos
      const eventosUrl = `https://desarrollosfutura.com:8444/eventos/filter-by-user/${this.userId}`;
      this.cargarEventos(eventosUrl);
    } else {
      // Si no está disponible, intentar obtenerlo de la URL
      this.activatedRoute.params.subscribe(params => {
        const idFromUrl = params['id'];
        if (!idFromUrl) {
          console.error('No se encontró un User ID en el servicio ni en la URL.');
          return;
        }

      });
    }

  }


  // Método para cargar eventos
  private cargarEventos(url: string): void {
    this.httpClient.get<Evento[]>(url).subscribe({
      next: (eventos) => {
        if (eventos.length === 0) {
          console.warn('No se encontraron eventos para este usuario.');
        } else {
          console.log('Eventos recibidos:', eventos);
        }
        this.eventos = eventos;
      },
      error: (error) => {
        console.error('Error al obtener los eventos:', error.message || error);
      }
    });
  }


  currentSection: string = 'cargarContenido';

  // Función para cambiar la sección
  showSection(section: string): void {
    this.currentSection = section;
  }

  // Función para cerrar sesión
  logout() {
    this.authService.removeToken();
    this.router.navigate(['/homelogout']);
  }

  // Función para manejar el cambio de archivo (imagen)
  onFileChange(event: Event) {
    let target = event.target as HTMLInputElement; // obtener el input de tipo file

    if (target.files === null || target.files.length === 0) {
      return; // no procesar si no hay archivo
    }

    this.photoFile = target.files[0]; // almacenar el archivo

    // OPCIONAL: PREVISUALIZAR LA IMAGEN POR PANTALLA
    let reader = new FileReader();
    reader.onload = event => this.photoPreview = reader.result as string;
    reader.readAsDataURL(this.photoFile);
  }

  // Función para guardar un evento
  save() {
    if (!this.authService) {
      return;
    }

    // Verificar si el userId está disponible
    if (!this.userId) {
      console.log('User ID is required to save the event');
      return;
    }




    // Si estamos creando un nuevo evento

  }

  // Función para navegar a la lista de eventos después de guardar



  // Método trackBy para mejorar el rendimiento de la lista





}





