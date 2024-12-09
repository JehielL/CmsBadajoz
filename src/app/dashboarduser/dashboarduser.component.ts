import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Evento } from '../interfaces/eventos.model';
import { User } from '../interfaces/user.model';
import * as AOS from 'aos';

@Component({
  selector: 'app-dashboarduser',
  standalone: true,
  imports: [DragDropModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './dashboarduser.component.html',
  styleUrl: './dashboarduser.component.css'
})
export class DashboarduserComponent implements OnInit {

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
  
  

  // Formulario para crear o actualizar evento
  eventsForm = new FormGroup({
    id: new FormControl<number>(0),
    titulo: new FormControl<string>(''),
    contenido: new FormControl<string>(''),
    photo: new FormControl<string>(''),
  });

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
      if(this.isLoggedin) {
        this.httpClient.get<User>('http://213.165.74.6:8443/users/' + this.userId)
          .subscribe(user => {
            this.user = user;
            if (user) {
             
            } else {
              console.error('No se pudo obtener la información del usuario.');
            }
          });
      }
    } );
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
      const eventosUrl = `http://213.165.74.6:8443/eventos/filter-by-user/${this.userId}`;
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

    // Crear FormData para enviar los datos
    let formData = new FormData();
    formData.append('id', this.eventsForm.get('id')?.value?.toString() ?? '0');
    formData.append('titulo', this.eventsForm.get('titulo')?.value ?? '');
    formData.append('contenido', this.eventsForm.get('contenido')?.value ?? '');
    formData.append('photo', this.eventsForm.get('photo')?.value ?? '');
    formData.append('userId', this.userId); // Asocia el userId correctamente

    if (this.photoFile) {
      formData.append("photo", this.photoFile); // Agregar la imagen si existe
    }

    // Comprobar cómo se está enviando la solicitud
    console.log('Form data being sent:', formData);

    // Si estamos actualizando el evento
    if (this.isUpdate) {
      this.httpClient.put<Evento>('http://213.165.74.6:8443/eventos/' + this.evento?.id, formData)
        .subscribe(
          response => {
            console.log('Event updated successfully:', response);
            this.navigateToList();
          },
          error => console.error('Error updating event:', error)
        );
    } else {
      // Si estamos creando un nuevo evento
      this.httpClient.post<Evento>('http://213.165.74.6:8443/eventos', formData)
        .subscribe(
          response => {
            console.log('Event created successfully:', response);
            this.navigateToList();
          },
          error => console.error('Error creating event:', error)
        );
    }
  }

  // Función para navegar a la lista de eventos después de guardar
  private navigateToList() {
    this.router.navigate(['/tokyo-home']);
  }
  

  // Método trackBy para mejorar el rendimiento de la lista
  trackByEvento(index: number, evento: Evento): number {
    return evento.id;
  }
  onDrop(event: CdkDragDrop<Evento[]>): void {
    const eventoId = event.item.data.id;
    this.httpClient.delete(`http://213.165.74.6:8443/eventos/${eventoId}`).subscribe({
      next: () => {
        console.log('Evento eliminado:', eventoId);
        this.eventos = this.eventos?.filter(evento => evento.id !== eventoId);
      },
      error: (error) => {
        console.error('Error al eliminar el evento:', error.message || error);
      }
    });
  }


  eliminarEventoBackend(id: number): void {
    this.httpClient.delete(`http://213.165.74.6:8443/eventos/${id}`).subscribe({
      next: () => console.log(`Evento con ID ${id} eliminado del backend.`),
      error: (err) => console.error(`Error al eliminar el evento:`, err)
    });
  }
}
  
