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

  logout() {
    localStorage.removeItem('chefpro_token');
    localStorage.removeItem('chefpro_user');
    this.setLoggedIn(false);
  }
}
