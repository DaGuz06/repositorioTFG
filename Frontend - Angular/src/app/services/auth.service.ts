import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('chefpro_token');
  }

  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  checkLoginStatus() {
    this.isLoggedInSubject.next(this.hasToken());
  }

  getCurrentUser() {
    const user = localStorage.getItem('chefpro_user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('chefpro_token');
    localStorage.removeItem('chefpro_user');
    this.setLoggedIn(false);
  }
}
