import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Nuestros Chefs</h1>
      <p class="subtitle">Descubre a los maestros culinarios listos para crear tu próxima experiencia inolvidable.</p>
      
      <div class="chefs-grid" *ngIf="chefs.length > 0">
        <div class="chef-card" *ngFor="let chef of chefs">
          <div class="image-wrapper">
             <img [src]="chef.image" [alt]="chef.name">
          </div>
          <div class="chef-info">
            <h2>{{ chef.name }}</h2>
            <p class="specialty">{{ chef.specialty }}</p>
            <div class="rating">⭐ {{ chef.rating }}</div>
            <button class="hire-btn">Contratar</button>
          </div>
        </div>
      </div>

      <div *ngIf="chefs.length === 0 && !loading" class="no-data">
        <p>No hay chefs disponibles en este momento.</p>
      </div>
      
      <div *ngIf="loading" class="loading">Cargando chefs...</div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 4rem 2rem;
      background-color: #f9f9f9;
      min-height: 80vh;
      text-align: center;
    }
    h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #666;
      margin-bottom: 3rem;
      font-size: 1.1rem;
    }
    .chefs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .chef-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .chef-card:hover {
      transform: translateY(-5px);
    }
    .image-wrapper {
      height: 200px;
      overflow: hidden;
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .chef-info {
      padding: 1.5rem;
    }
    .chef-info h2 {
      color: #333;
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
    }
    .specialty {
      color: #7A8A56;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .rating {
      color: #C7A446;
      margin-bottom: 1.5rem;
    }
    .hire-btn {
      width: 100%;
      padding: 0.8rem;
      background-color: #C7A446;
      color: white;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .hire-btn:hover {
      background-color: #7A8A56;
    }
    .loading, .no-data {
      color: #666;
      font-size: 1.2rem;
      margin-top: 3rem;
    }
  `]
})
export class ChefsComponent implements OnInit {
  chefs: any[] = [];
  loading = true;
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any[]>('/api/chefs').subscribe({
      next: (data) => {
        this.chefs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
