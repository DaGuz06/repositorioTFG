import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Completa tu Perfil</h2>
        <p class="auth-subtitle">Cuéntanos más sobre tu cocina para que los comensales te encuentren.</p>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="work_zone">Zona de Trabajo</label>
            <input type="text" id="work_zone" name="work_zone" [(ngModel)]="formData.work_zone" placeholder="Ej: Madrid Centro, Barcelona..." required>
          </div>

          <div class="form-group">
            <label for="specialties">Especialidades (separadas por comas)</label>
            <input type="text" id="specialties" name="specialties" [(ngModel)]="formData.specialties" placeholder="Ej: Italiana, Sushi, Vegana" required>
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="has_vehicle" name="has_vehicle" [(ngModel)]="formData.has_vehicle">
            <label for="has_vehicle">¿Tienes vehículo propio?</label>
          </div>

          <div class="form-group">
            <label for="bio">Biografía / Presentación</label>
            <textarea id="bio" name="bio" [(ngModel)]="formData.bio" placeholder="Describe tu experiencia y pasión por la cocina..." rows="4" required></textarea>
          </div>

          <button type="submit" class="auth-button">Guardar Perfil</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      background-color: #f9f9f9;
      padding: 2rem;
    }
    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    h2 { color: #333; margin-bottom: 0.5rem; }
    .auth-subtitle { color: #666; margin-bottom: 2rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { text-align: left; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; }
    .form-group input[type="text"], .form-group textarea {
      width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; box-sizing: border-box;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: #C7A446; outline: none;
    }
    .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
    .checkbox-group input { width: auto; }
    .checkbox-group label { margin-bottom: 0; }
    .auth-button {
      background-color: #C7A446; color: white; border: none; padding: 1rem;
      font-size: 1.1rem; border-radius: 50px; cursor: pointer; margin-top: 1rem; width: 100%;
    }
    .auth-button:hover { background-color: #7A8A56; }
  `]
})
export class CompleteProfileComponent implements OnInit {
  formData = {
    work_zone: '',
    specialties: '',
    has_vehicle: false,
    bio: ''
  };

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    const userStr = localStorage.getItem('chefpro_user');
    if (!userStr) {
      alert('Debes iniciar sesión primero');
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(userStr);

    // Fetch existing profile to pre-fill
    this.http.get<any>(`/api/chefs/${user.id}`).subscribe({
      next: (data) => {
        if (data) {
          this.formData = {
            work_zone: data.work_zone || '',
            specialties: data.specialties ? data.specialties.join(', ') : '',
            has_vehicle: data.has_vehicle,
            bio: data.bio || ''
          };
        }
      },
      error: (err) => {
        // 404 is expected for new profiles, ignore
        if (err.status !== 404) console.error(err);
      }
    });
  }

  onSubmit() {
    const userStr = localStorage.getItem('chefpro_user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    const payload = {
      ...this.formData,
      user_id: user.id
    };

    this.http.post('/api/chefs/profile', payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Perfil guardado correctamente');
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el perfil');
      }
    });
  }
}
