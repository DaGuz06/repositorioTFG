import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChefsComponent } from './components/chefs/chefs.component';
import { MenuOfMonthComponent } from './components/menu-of-month/menu-of-month.component';
import { AboutComponent } from './components/about/about.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'chefs', component: ChefsComponent },
    { path: 'menu-of-month', component: MenuOfMonthComponent },
    { path: 'about', component: AboutComponent },
    { path: 'complete-profile', component: CompleteProfileComponent }
];
