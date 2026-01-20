import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  private router = inject(Router);

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // strict check for token existence
    this.isLoggedIn = !!localStorage.getItem('chefpro_token');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    localStorage.removeItem('chefpro_token');
    localStorage.removeItem('chefpro_user');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
