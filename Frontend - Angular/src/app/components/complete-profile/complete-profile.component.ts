import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChefService } from '../../services/chef.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="form-card">
        <h2>Completa tu Perfil de Chef</h2>
        <p class="subtitle">Cuéntanos más sobre ti para que los comensales puedan encontrarte.</p>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="specialties">Especialidades (separadas por comas)</label>
            <input id="specialties" type="text" formControlName="specialties" placeholder="Ej: Italiana, Sushi, Vegana">
          </div>

          <div class="form-group">
            <label for="work_zone">Zona de Trabajo</label>
            <input id="work_zone" type="text" formControlName="work_zone" placeholder="Ej: Madrid Centro, Barcelona, Sevilla">
          </div>

          <div class="form-group checkbox-group">
            <input id="has_vehicle" type="checkbox" formControlName="has_vehicle">
            <label for="has_vehicle">¿Dispones de vehículo propio?</label>
          </div>

          <div class="form-group">
            <label for="bio">Biografía / Sobre mí</label>
            <textarea id="bio" formControlName="bio" rows="4" placeholder="Describe tu experiencia y pasión por la cocina..."></textarea>
          </div>

          <button type="submit" [disabled]="profileForm.invalid || loading" class="submit-btn">
            {{ loading ? 'Guardando...' : 'Guardar Perfil' }}
          </button>

          <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      justify-content: center;
      padding: 4rem 2rem;
      background-color: #f9f9f9;
      min-height: 80vh;
    }
    .form-card {
      background: white;
      padding: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 600px;
    }
    h2 {
      color: #333;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    input[type="text"]:focus, textarea:focus {
      border-color: #C7A446;
      outline: none;
    }
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .checkbox-group input {
      width: auto;
      transform: scale(1.2);
    }
    .checkbox-group label {
      margin-bottom: 0;
      cursor: pointer;
    }
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background-color: #C7A446;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
      margin-top: 1rem;
    }
    .submit-btn:hover:not(:disabled) {
      background-color: #7A8A56;
    }
    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc3545;
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class CompleteProfileComponent {
  private fb = inject(FormBuilder);
  private chefService = inject(ChefService);
  private router = inject(Router);

  profileForm = this.fb.group({
    specialties: ['', Validators.required],
    work_zone: ['', Validators.required],
    has_vehicle: [false],
    bio: ['', Validators.required]
  });

  loading = false;
  errorMessage = '';

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    const userStr = localStorage.getItem('chefpro_user');

    if (!userStr) {
      this.errorMessage = 'No has iniciado sesión.';
      this.loading = false;
      return;
    }

    const user = JSON.parse(userStr);
    const profileData = {
      ...this.profileForm.value,
      user_id: user.id
    };

    this.chefService.createProfile(profileData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error saving profile', err);
        this.errorMessage = 'Hubo un error al guardar el perfil. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
}
