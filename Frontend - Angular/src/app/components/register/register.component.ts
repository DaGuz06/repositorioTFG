import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: 2 // Default to Diner
  };

  onSubmit() {
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.http.post('/api/auth/register', this.formData).subscribe({
      next: (res: any) => {
        alert('Registro exitoso! Por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error en el registro: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
}
  