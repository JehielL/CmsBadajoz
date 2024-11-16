import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as AOS from 'aos'; 
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient} from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-tokyo-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './tokyo-home.component.html',
  styleUrl: './tokyo-home.component.css'
})
export class TokyoHomeComponent implements OnInit {
  collapsed = true;
  userId: string | null = null;
  isAdmin = false;
  isLoggedin = false;
  user: User | undefined;



  activedLoader = true;


  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    ){

    if(this.authService) {
      this.authService.isLoggedin.subscribe(isLoggedin => this.isLoggedin = isLoggedin);
      this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
      this.authService.userId.subscribe(userId => this.userId = userId);
      this.authService.avatarUrl.subscribe(avatarUrl => {
        if(this.user) {
          this.user.imgUser = avatarUrl;
        }
      });
    }
  }

  getUserAvatar() {
    if(this.user) {
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
    
    setTimeout(() => {
      this.activedLoader = false;
    }, 1100); 
    window.scrollTo(0, 0); 
    
  }

}
