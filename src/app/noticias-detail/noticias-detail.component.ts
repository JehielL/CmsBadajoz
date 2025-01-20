import { Component, OnInit } from '@angular/core';
import { Noticia } from '../interfaces/noticia.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LazyLoadDirective } from '../lazy-load.directive';

@Component({
  selector: 'app-noticias-detail',
  standalone: true,
  imports: [HttpClientModule, LazyLoadDirective],
  templateUrl: './noticias-detail.component.html',
  styleUrl: './noticias-detail.component.css'
})
export class NoticiasDetailComponent implements OnInit {

   noticia: Noticia | undefined;
   placeholderImage: string = '/assets/DIPUTACION-BADAJOZ-DESTINO.jpg';
  
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient
    ) { }
  
    ngOnInit(): void {
      const identifier = this.route.snapshot.paramMap.get('id');
  
      if (identifier) {
        const url = `/assets/response_noticia.json`; // URL a tu JSON
        this.http.get<Noticia[]>(url).subscribe({
          next: noticias => {
            this.noticia = noticias.find(noticia => noticia.identifier.toString() === identifier);
          },
          error: err => {
            console.error('Error al cargar los detalles de evento:', err);
          }
        });
      }
    }
}
