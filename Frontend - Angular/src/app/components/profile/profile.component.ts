import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>Mi Perfil</h2>
        <div class="profile-info" *ngIf="user">
          <div class="info-item">
            <span class="label">Nombre:</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Rol:</span>
            <span class="value">{{ user.role_id === 1 ? 'Chef' : 'Comensal' }}</span>
          </div>

          <!-- Extended Info for Chefs -->
          <ng-container *ngIf="user.role_id === 1 && fullProfile">
            <div class="info-item">
              <span class="label">Zona:</span>
              <span class="value">{{ fullProfile.work_zone || 'No especificada' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Especialidades:</span>
              <span class="value">{{ fullProfile.specialties?.join(', ') || 'Ninguna' }}</span>
            </div>
             <div class="info-item">
              <span class="label">Vehículo:</span>
              <span class="value">{{ fullProfile.has_vehicle ? 'Sí' : 'No' }}</span>
            </div>
            <div class="bio-section">
                <span class="label">Biografía:</span>
                <p class="bio-text">{{ fullProfile.bio || 'Sin biografía' }}</p>
            </div>
          </ng-container>
        </div>

        <div class="actions" *ngIf="user && user.role_id === 1">
            <button routerLink="/complete-profile" class="edit-btn">Editar Perfil</button>
        </div>

        <div *ngIf="!user">
          <p>No se encontró información del usuario. Por favor inicia sesión nuevamente.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 4rem 2rem;
      background-color: #f9f9f9;
      min-height: 70vh;
    }
    .profile-card {
      background: white;
      padding: 2.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 500px;
    }
    h2 {
      color: #333;
      margin-bottom: 2rem;
      border-bottom: 2px solid #C7A446;
      padding-bottom: 1rem;
    }
    .info-item {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    .label {
      font-weight: 600;
      color: #7A8A56;
    }
    .value {
      color: #555;
    }
    .bio-section {
        margin-top: 1rem;
        border-top: 1px solid #eee;
        padding-top: 1rem;
    }
    .bio-text {
        margin-top: 0.5rem;
        color: #555;
        line-height: 1.5;
        font-style: italic;
    }
    .actions {
        margin-top: 2rem;
        text-align: center;
    }
    .edit-btn {
        background-color: #333;
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
    }
    .edit-btn:hover {
        background-color: #555;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  fullProfile: any = null;
  private http = inject(HttpClient);

  ngOnInit() {
    const userStr = localStorage.getItem('chefpro_user');
    if (userStr) {
      this.user = JSON.parse(userStr);

      // If user is chef, fetch full profile
      if (this.user.id && this.user.role_id === 1) {
        this.http.get<any>(`/api/chefs/${this.user.id}`).subscribe({
          next: (data) => this.fullProfile = data,
          error: (err) => console.error('Error loading extra profile info', err)
        });
      }
    }
  }
}
