import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-chef-of-month',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="content-card">
        <h1>Chef del Mes</h1>
        <div *ngIf="chef" class="chef-highlight">
          <img [src]="chef.image" [alt]="chef.name" class="chef-image">
          <div class="chef-details">
            <h2>{{ chef.name }}</h2>
            <p class="specialty">Especialidad: {{ chef.specialty }}</p>
            <div class="rating">Rating: ⭐ {{ chef.rating }}</div>
            <p class="bio">
              Reconocido por su excelencia culinaria y creatividad innovadora. 
              Este mes celebramos su dedicación a la cocina {{ chef.specialty.toLowerCase() }}.
            </p>
          </div>
        </div>
        <div *ngIf="!chef" class="loading">
          Cargando chef destacado...
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      padding: 4rem 2rem;
      background-color: #f9f9f9;
      min-height: 80vh;
      display: flex;
      justify-content: center;
    }
    .content-card {
      background: white;
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      max-width: 800px;
      width: 100%;
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
    }
    .chef-highlight {
      display: flex;
      gap: 3rem;
      align-items: center;
    }
    .chef-image {
      width: 300px;
      height: 300px;
      object-fit: cover;
      border-radius: 50%;
      border: 5px solid #C7A446;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .chef-details h2 {
      color: #7A8A56;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .specialty {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    .rating {
      font-size: 1.2rem;
      color: #C7A446;
      margin-bottom: 2rem;
    }
    .bio {
      line-height: 1.6;
      color: #555;
    }
    @media (max-width: 768px) {
      .chef-highlight {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ChefOfMonthComponent implements OnInit {
    chef: any = null;
    private http = inject(HttpClient);

    ngOnInit() {
        // Fetch chefs and pick the first one as "Chef of the Month"
        this.http.get<any[]>('/api/chefs').subscribe({
            next: (chefs) => {
                if (chefs && chefs.length > 0) {
                    this.chef = chefs[0];
                }
            },
            error: (err) => console.error(err)
        });
    }
}
