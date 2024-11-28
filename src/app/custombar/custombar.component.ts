import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-custombar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './custombar.component.html',
  styleUrl: './custombar.component.css'
})
export class CustombarComponent {

  constructor(private location: Location){

  }

  retroceder(): void {
    this.location.back();
  }

}
