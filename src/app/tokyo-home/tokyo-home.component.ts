import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos'; 


@Component({
  selector: 'app-tokyo-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tokyo-home.component.html',
  styleUrl: './tokyo-home.component.css'
})
export class TokyoHomeComponent implements OnInit {
  collapsed = true;

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
