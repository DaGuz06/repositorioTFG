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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.idToken;

        if (token) {
          this.http.post('/api/auth/google', { token }).subscribe({
            next: (res: any) => {
               this.handleAuthResponse(res);
            },
            error: (err) => {
              console.error('Google Auth backend error:', err);
              alert('Error validando con el servidor: ' + (err.error?.message || err.message));
            }
          });
        } else {
           // Fallback or error if no Google token
           console.error('No Google ID token found');
           alert('No se pudo obtener el token de Google');
        }
      })
      .catch((error) => {
        console.error('Google Sign-In failed:', error);
        alert('Error con Google Sign-In: ' + error.message);
      });
  }

  private handleAuthResponse(res: any) {
    if (res.success && res.token) {
      localStorage.setItem('chefpro_token', res.token);
      if (res.user) {
        localStorage.setItem('chefpro_user', JSON.stringify(res.user));
      }
      
      // Notify AuthService that user is logged in
      this.authService.setLoggedIn(true);

      // Navigate based on role
      if (res.user && res.user.role_id === 1) {
        this.router.navigate(['/complete-profile']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}

