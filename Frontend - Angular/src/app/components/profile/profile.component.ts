import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ChefService } from '../../services/chef.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="profile-container" *ngIf="user">
      
      <!-- HEADER: Nombre + Avatar -->
      <div class="header-section">
          <div class="header-content">
              <h1>{{ user.name }}</h1>
          </div>
          <div class="avatar-circle">
              <!-- Placeholder avatar logic -->
              <span>{{ getInitials(user.name) }}</span>
          </div>
      </div>

      <!-- REVIEWS SECTION -->
      <div class="section-box reviews-box">
          <h2>Últimas valoraciones</h2>
          <div class="reviews-list" *ngIf="reviews.length > 0; else noReviews">
              <div class="review-item" *ngFor="let review of reviews">
                  <div class="review-header">
                      <span class="stars">{{ '⭐'.repeat(review.rating) }}</span>
                      <span class="date">{{ review.created_at | date:'shortDate' }}</span>
                  </div>
                  <p class="review-text">"{{ review.text }}"</p>
              </div>
          </div>
          <ng-template #noReviews>
              <p class="empty-msg">Aún no hay valoraciones.</p>
          </ng-template>
      </div>

      <!-- MENUS SECTION -->
      <div class="section-box menus-box">
          <div class="menus-grid">
              <!-- Menu Items -->
              <div class="menu-card" *ngFor="let menu of menus">
                  <h3>{{ menu.title }}</h3>
                  <p class="menu-desc">{{ menu.description || 'Sin descripción' }}</p>
                  <span class="price">{{ menu.price }}€</span>
                  <button *ngIf="isOwner" (click)="deleteMenu(menu.id)" class="delete-btn">🗑️</button>
              </div>

               <!-- ADD MENU BUTTON (Only for Chef Owner) -->
              <div class="menu-card add-card" *ngIf="isOwner" (click)="showAddMenuForm = !showAddMenuForm">
                  <h3>+ Añadir platos</h3>
                  <p>Solo si eres el chef</p>
              </div>
          </div>
      </div>

      <!-- ADD MENU FORM (Toggleable) -->
      <div class="add-menu-form" *ngIf="showAddMenuForm">
          <h3>Añadir Nuevo Menú</h3>
          <form [formGroup]="menuForm" (ngSubmit)="onAddMenu()">
              <input formControlName="title" placeholder="Nombre del plato/menú">
              <input formControlName="description" placeholder="Descripción">
              <input type="number" formControlName="price" placeholder="Precio (€)">
              <div class="form-actions">
                  <button type="button" (click)="showAddMenuForm = false">Cancelar</button>
                  <button type="submit" [disabled]="menuForm.invalid">Guardar</button>
              </div>
          </form>
      </div>

      <!-- Action: Edit Profile (if owner) -->
       <div class="actions" *ngIf="isOwner">
            <button routerLink="/complete-profile" class="edit-profile-link">Editar información del perfil</button>
        </div>

    </div>

    <div *ngIf="!user" class="loading-msg">Please login...</div>
  `,
  styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 4rem 2rem;
      background-color: #fcfcfc;
      min-height: 80vh;
      font-family: 'Helvetica Neue', sans-serif;
    }

    /* HEADER */
    .header-section {
      background: white;
      padding: 2rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border-left: 5px solid #C7A446; /* Gold accent */
    }
    .header-section h1 {
      margin: 0;
      font-size: 2.2rem;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .avatar-circle {
      width: 70px;
      height: 70px;
      background-color: #7A8A56; /* Green */
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.8rem;
      box-shadow: 0 4px 10px rgba(122, 138, 86, 0.3);
    }

    /* SECTION BOXES */
    .section-box {
      background: white;
      padding: 2rem;
      margin-bottom: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .reviews-box h2, .menus-box h2 {
      margin-top: 0;
      color: #333;
      font-size: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    .review-item {
      background: #f9f9f9;
      padding: 1.2rem;
      margin-bottom: 1rem;
      border-radius: 10px;
      border-left: 4px solid #C7A446;
      transition: transform 0.2s ease;
    }
    .review-item:hover {
        transform: translateX(5px);
    }
    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    .review-text { 
        font-style: italic; 
        color: #555; 
        margin: 0;
        line-height: 1.5;
    }
    .stars { color: #C7A446; } /* Gold stars */

    /* MENUS GRID */
    .menus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem;
    }
    .menu-card {
      background: white;
      border: 1px solid #eee;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 180px;
      position: relative;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .menu-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        border-color: #C7A446;
    }
    .menu-card h3 { 
        margin: 0 0 0.8rem 0; 
        font-size: 1.3rem; 
        color: #333;
    }
    .menu-desc {
        color: #666;
        font-size: 0.95rem;
        flex-grow: 1;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    .price { 
        font-weight: 700; 
        color: #7A8A56; /* Green price */
        font-size: 1.3rem;
        align-self: flex-end;
    }
    .delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.3;
        transition: opacity 0.2s;
        font-size: 1.1rem;
    }
    .delete-btn:hover { opacity: 1; color: #dc3545; }

    .add-card {
      border: 2px dashed #C7A446;
      background: #fffdf5; /* Light gold tint */
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-align: center;
      color: #C7A446;
    }
    .add-card:hover { 
        background: #fff8e1; 
        transform: scale(1.02);
    }
    .add-card h3 { color: #C7A446; margin-bottom: 0.5rem; }
    .add-card p { color: #7A8A56; font-size: 0.9rem; }

    /* FORM */
    .add-menu-form {
        background: white;
        padding: 2.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        margin-bottom: 3rem;
        border-top: 5px solid #C7A446;
        animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .add-menu-form h3 {
        margin-top: 0;
        color: #333;
        margin-bottom: 1.5rem;
    }
    .add-menu-form input {
        display: block;
        width: 100%;
        margin-bottom: 1.2rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        transition: border-color 0.3s;
    }
    .add-menu-form input:focus {
        border-color: #C7A446;
        outline: none;
    }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .form-actions button {
        padding: 0.8rem 2rem;
        cursor: pointer;
        border-radius: 25px;
        font-weight: 600;
        border: none;
        transition: background 0.3s;
    }
    .form-actions button[type="button"] {
        background: #f0f0f0;
        color: #666;
    }
    .form-actions button[type="button"]:hover { background: #e0e0e0; }
    
    .form-actions button[type="submit"] {
        background: #C7A446;
        color: white;
    }
    .form-actions button[type="submit"]:hover:not(:disabled) {
        background: #b08d35;
    }

    .edit-profile-link {
        background: #333;
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s;
        text-decoration: none;
        display: inline-block;
    }
    .edit-profile-link:hover { background: #555; }
    .actions { text-align: right; margin-top: -1rem; margin-bottom: 3rem; }
    
    .loading-msg, .empty-msg { text-align: center; color: #999; font-style: italic; padding: 2rem;}
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  fullProfile: any = null;
  reviews: any[] = [];
  menus: any[] = [];
  isOwner = false;
  showAddMenuForm = false;

  private chefService = inject(ChefService);
  private fb = inject(FormBuilder);

  menuForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    const userStr = localStorage.getItem('chefpro_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.isOwner = this.user.role_id === 1; // Assuming 1 is Chef

      // Load Profile Data
      if (this.isOwner) {
        this.loadChefData(this.user.id);
      }
    }
  }

  loadChefData(chefId: number) {
    this.chefService.getChefById(chefId).subscribe(data => this.fullProfile = data);
    this.chefService.getChefReviews(chefId).subscribe(data => this.reviews = data);
    this.chefService.getChefMenus(chefId).subscribe(data => this.menus = data);
  }

  onAddMenu() {
    if (this.menuForm.invalid) return;

    const newMenu = {
      ...this.menuForm.value,
      chef_id: this.user.id
    };

    this.chefService.addMenu(newMenu).subscribe({
      next: () => {
        this.loadChefData(this.user.id); // Reload menus
        this.showAddMenuForm = false;
        this.menuForm.reset();
      },
      error: (err) => console.error('Error adding menu', err)
    });
  }

  deleteMenu(id: number) {
    if (!confirm('¿Seguro que quieres borrar este plato?')) return;
    this.chefService.deleteMenu(id).subscribe(() => {
      this.loadChefData(this.user.id);
    });
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
