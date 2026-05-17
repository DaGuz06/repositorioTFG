import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChefsComponent } from './components/chefs/chefs.component';
import { AboutComponent } from './components/about/about.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { LoginAdminComponent } from './components/loginAdmin/loginAdmin.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ChefDetailComponent } from './components/chef-detail/chef-detail.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { chefGuard } from './guards/chef.guard';
import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'loginAdmin', component: LoginAdminComponent },
    { path: 'admin-panel', component: AdminPanelComponent, canActivate: [adminGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'chefs', component: ChefsComponent },
    { path: 'chef/:id', component: ChefDetailComponent },
    { path: 'about', component: AboutComponent },
    { path: 'complete-profile', component: CompleteProfileComponent, canActivate: [authGuard] },
    { path: 'reservations', component: ReservationComponent, canActivate: [authGuard] },
    { path: 'chef-dashboard', component: ChefDashboardComponent, canActivate: [chefGuard] }
];
