import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  active: number;
  created_at: string;
}

interface Chef {
  user_id: number;
  name: string;
  email: string;
  specialties: string;
  work_zone: string;
  rating: number;
}

interface Review {
  id: number;
  chef_id: number;
  user_id: number;
  text: string;
  rating: number;
  created_at: string;
  chef_name?: string;
  user_name?: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  activeTab: 'users' | 'chefs' | 'reviews' = 'users';
  users: User[] = [];
  chefs: Chef[] = [];
  reviews: Review[] = [];
  loading = false;

  ngOnInit() {
    this.checkAdminAccess();
    this.loadUsers();
  }

  checkAdminAccess() {
    const userStr = localStorage.getItem('chefpro_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role_id !== 3) {
        alert('Acceso denegado: Solo administradores pueden acceder');
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/loginAdmin']);
    }
  }

  switchTab(tab: 'users' | 'chefs' | 'reviews') {
    this.activeTab = tab;
    if (tab === 'users') this.loadUsers();
    else if (tab === 'chefs') this.loadChefs();
    else if (tab === 'reviews') this.loadReviews();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any>('/api/admin/users').subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  loadChefs() {
    this.loading = true;
    this.http.get<any>('/api/admin/chefs').subscribe({
      next: (res) => {
        this.chefs = res.chefs || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading chefs:', err);
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.loading = true;
    this.http.get<any>('/api/admin/reviews').subscribe({
      next: (res) => {
        this.reviews = res.reviews || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loading = false;
      }
    });
  }

  toggleUserStatus(userId: number, currentStatus: number) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    this.http.put(`/api/admin/users/${userId}/status`, { active: newStatus }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user status:', err);
        alert('Error al actualizar el estado del usuario');
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.http.delete(`/api/admin/users/${userId}`).subscribe({
        next: () => {
          this.loadUsers();
          alert('Usuario eliminado correctamente');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  deleteReview(reviewId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.http.delete(`/api/admin/reviews/${reviewId}`).subscribe({
        next: () => {
          this.loadReviews();
          alert('Reseña eliminada correctamente');
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          alert('Error al eliminar la reseña');
        }
      });
    }
  }

  getRoleName(roleId: number): string {
    switch(roleId) {
      case 1: return 'Chef';
      case 2: return 'Comensal';
      case 3: return 'Admin';
      default: return 'Desconocido';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/loginAdmin']);
  }
}
