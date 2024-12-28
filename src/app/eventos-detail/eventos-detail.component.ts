import { Component, OnInit } from '@angular/core';
import { EventosBadajoz } from '../interfaces/eventosbadajoz.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-eventos-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './eventos-detail.component.html',
  styleUrl: './eventos-detail.component.css'
})
export class EventosDetailComponent implements OnInit {


  evento: EventosBadajoz | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('id');

    if (identifier) {
      const url = `/assets/response_evento.json`; // URL a tu JSON
      this.http.get<EventosBadajoz[]>(url).subscribe({
        next: eventos => {
          this.evento = eventos.find(evento => evento.identifier.toString() === identifier);
        },
        error: err => {
          console.error('Error al cargar los detalles de evento:', err);
        }
      });
    }
  }
}
