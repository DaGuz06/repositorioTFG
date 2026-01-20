import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  formData = {
    email: '',
    password: ''
  };

  onSubmit() {
    this.http.post('/api/auth/login', this.formData).subscribe({
      next: (res: any) => {
        if (res.success && res.token) {
          localStorage.setItem('chefpro_token', res.token);
          if (res.user) {
            localStorage.setItem('chefpro_user', JSON.stringify(res.user));

            if (res.user.role_id === 1) {
              this.router.navigate(['/complete-profile']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error en el inicio de sesión: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
}
