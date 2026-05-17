import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChefService } from '../../services/chef.service';
import { Router } from '@angular/router';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUrlPipe],
  template: `
    <div class="page-container">
      <h1>Nuestros Chefs</h1>
      <p class="subtitle">Descubre a los maestros culinarios listos para crear tu próxima experiencia inolvidable.</p>

      <!-- Search / Filter -->
      <div class="filter-bar" *ngIf="!loading">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Buscar por nombre, especialidad o zona..."
          class="search-input"
          (input)="filterChefs()"
        >
      </div>

      <!-- Loading skeleton -->
      <div class="chefs-grid" *ngIf="loading">
        <div class="chef-card skeleton-card" *ngFor="let i of [1,2,3,4,5,6]">
          <div class="skeleton image-skeleton"></div>
          <div class="chef-info">
            <div class="skeleton text-skeleton title-skel"></div>
            <div class="skeleton text-skeleton spec-skel"></div>
            <div class="skeleton text-skeleton rating-skel"></div>
            <div class="skeleton text-skeleton btn-skel"></div>
          </div>
        </div>
      </div>

      <div class="chefs-grid" *ngIf="filteredChefs.length > 0 && !loading">
        <div class="chef-card" *ngFor="let chef of filteredChefs">
          <div class="image-wrapper">
             <img [src]="chef.image | imageUrl" [alt]="chef.name" onerror="this.src='/profileIcon.svg'">
          </div>
          <div class="chef-info">
            <h2>{{ chef.name }}</h2>
            <p class="specialty">{{ chef.specialties ? chef.specialties.join(', ') : chef.specialty }}</p>
            <div class="rating">⭐ {{ chef.rating }}</div>
            <p class="zone" *ngIf="chef.work_zone">📍 {{ chef.work_zone }}</p>
            <div class="actions">
              <button class="hire-btn" (click)="hireChef(chef.id)">Contratar</button>
              <button class="profile-btn" (click)="viewProfile(chef.id)">Ver Perfil</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredChefs.length === 0 && !loading && chefs.length > 0" class="no-data">
        <p>No se encontraron chefs con "{{ searchTerm }}"</p>
        <button class="clear-btn" (click)="clearSearch()">Limpiar búsqueda</button>
      </div>

      <div *ngIf="chefs.length === 0 && !loading" class="no-data">
        <p>No hay chefs disponibles en este momento.</p>
      </div>
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
      color: #2D3035;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    /* Filter bar */
    .filter-bar {
      max-width: 500px;
      margin: 0 auto 3rem;
    }
    .search-input {
      width: 100%;
      padding: 0.9rem 1.5rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
      background-color: white;
    }
    .search-input:focus {
      border-color: #C7A446;
      outline: none;
      box-shadow: 0 0 0 4px rgba(199, 164, 70, 0.12);
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
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
    }
    .chef-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      border-color: #C7A446;
    }
    .image-wrapper {
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background-color: #f0f0f0;
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 20%;
      transition: transform 0.3s ease;
    }
    .chef-card:hover .image-wrapper img {
      transform: scale(1.05);
    }
    .chef-info {
      padding: 1.5rem;
    }
    .chef-info h2 {
      color: #2D3035;
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
    }
    .specialty {
      color: #7A8A56;
      font-weight: 500;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    .rating {
      color: #C7A446;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .zone {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 1rem;
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
      transition: all 0.3s ease;
    }
    .hire-btn:hover {
      background-color: #b5933a;
      transform: translateY(-1px);
    }
    .no-data {
      color: #666;
      font-size: 1.1rem;
      margin-top: 3rem;
    }
    .clear-btn {
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      background: transparent;
      border: 2px solid #C7A446;
      color: #C7A446;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .clear-btn:hover {
      background-color: #C7A446;
      color: white;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    .profile-btn {
      width: 100%;
      padding: 0.8rem;
      background-color: transparent;
      color: #7A8A56;
      border: 2px solid #7A8A56;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .profile-btn:hover {
      background-color: #7A8A56;
      color: white;
    }

    /* Skeleton loader */
    .skeleton-card {
      pointer-events: none;
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 8px;
    }
    .image-skeleton {
      height: 200px;
      border-radius: 0;
    }
    .text-skeleton {
      height: 16px;
      margin-bottom: 0.75rem;
    }
    .title-skel { width: 60%; }
    .spec-skel { width: 80%; }
    .rating-skel { width: 30%; }
    .btn-skel { width: 100%; height: 40px; border-radius: 25px; }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class ChefsComponent implements OnInit {
  chefs: any[] = [];
  filteredChefs: any[] = [];
  loading = true;
  searchTerm = '';
  private chefService = inject(ChefService);
  private router = inject(Router);

  ngOnInit() {
    this.chefService.getChefs().subscribe({
      next: (data) => {
        this.chefs = data;
        this.filteredChefs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterChefs() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredChefs = this.chefs;
      return;
    }

    this.filteredChefs = this.chefs.filter(chef => {
      const name = (chef.name || '').toLowerCase();
      const specialties = (chef.specialties || []).join(', ').toLowerCase();
      const zone = (chef.work_zone || '').toLowerCase();
      return name.includes(term) || specialties.includes(term) || zone.includes(term);
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredChefs = this.chefs;
  }

  viewProfile(id: number) {
    this.router.navigate(['/chef', id]);
  }

  hireChef(id: number) {
    this.router.navigate(['/reservations'], { queryParams: { chefId: id } });
  }
}
