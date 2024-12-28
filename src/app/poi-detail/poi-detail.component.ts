import { Component, OnInit } from '@angular/core';
import { Multimedia } from '../interfaces/multimedia.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-poi-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './poi-detail.component.html',
  styleUrl: './poi-detail.component.css'
})
export class PoiDetailComponent implements OnInit {

  poi: Multimedia | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('id');

    if (identifier) {
      const url = `/assets/response_poi.json`; // URL a tu JSON
      this.http.get<Multimedia[]>(url).subscribe({
        next: pois => {
          this.poi = pois.find(poi => poi.identifier.toString() === identifier);
        },
        error: err => {
          console.error('Error al cargar los detalles del POI:', err);
        }
      });
    }
  }
}
