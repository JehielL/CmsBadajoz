import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'; 

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  activedLoader = true;
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
