import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../interfaces/login.dto';
import { Token } from '../interfaces/token.dto';
import * as AOS from 'aos'; 


@Component({
  selector: 'app-home-sin-log',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './home-sin-log.component.html',
  styleUrls: ['./home-sin-log.component.css'], // Asegúrate de usar "styleUrls" en plural
})

export class HomeSinLogComponent implements OnInit {

  activedLoader = true;
  
  errorMessage: string = '';
  loginForm: FormGroup;

  isModalVisible: boolean = false;

  // Método para abrir el modal
  openModal() {
    this.isModalVisible = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalVisible = false;
  }

  constructor(
    private fb: FormBuilder, 
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.activedLoader = false;
    }, 1100);
    window.scrollTo(0, 0);

    AOS.init({
      duration: 1500, 
      offset: 200,   
      once: true,
    });
  }



  save() {
    const login: Login = {
      email: this.loginForm.get('email')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? '',
    };

    this.httpClient.post<Token>('https://213.165.74.6:8444/users/login', login).subscribe({
      next: (response) => {
        console.log(response.token);
        this.authService.saveToken(response.token);
        this.router.navigate(['/tokyo-home']);
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'El usuario o la contraseña son incorrectos';
        }
      }
    });
  }
}
