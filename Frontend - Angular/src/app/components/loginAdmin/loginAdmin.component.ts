import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './loginAdmin.component.html',
  styleUrls: ['./loginAdmin.component.css']
})
export class LoginAdminComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);
  private authService = inject(AuthService);

  formData = {
    email: '',
    password: ''
  };

  onSubmit() {
    this.http.post('/api/auth/login', this.formData).subscribe({
      next: (res: any) => {
        this.handleAuthResponse(res);
      },
      error: (err) => {
        console.error(err);
        alert('Error en el inicio de sesión: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  private handleAuthResponse(res: any) {
    if (res.success && res.token) {
      localStorage.setItem('chefpro_token', res.token);
      if (res.user) {
        localStorage.setItem('chefpro_user', JSON.stringify(res.user));
      }
      

      this.authService.setLoggedIn(true);

      // Verify admin role
      if (res.user && res.user.role_id === 3) {
        this.router.navigate(['/admin-panel']);
      } else {
        alert('Acceso denegado: Solo administradores pueden acceder a esta área');
        this.authService.logout();
        this.router.navigate(['/loginAdmin']);
      }
    }
  }
}

