import { Component } from '@angular/core';
import { Empresa } from '../interfaces/empresas.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-empresas-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './empresas-detail.component.html',
  styleUrl: './empresas-detail.component.css'
})
export class EmpresasDetailComponent {


  
    empresa: Empresa | undefined;
  
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient
    ) { }
  
    ngOnInit(): void {
      const identifier = this.route.snapshot.paramMap.get('id');
  
      if (identifier) {
        const url = `/assets/response_empresas.json`; // URL a tu JSON
        this.http.get<Empresa[]>(url).subscribe({
          next: empresas => {
            this.empresa = empresas.find(empresa => empresa.identifier.toString() === identifier);
          },
          error: err => {
            console.error('Error al cargar los detalles de empresa:', err);
          }
        });
      }
    }
}
