import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { CustombarComponent } from "./custombar/custombar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, ChatbotComponent, CustombarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CmsTokyoAndchat';

  ngOnInit(): void {
   
    window.scrollTo(0, 0); 
  }
}
