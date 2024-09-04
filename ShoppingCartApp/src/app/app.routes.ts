import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './user-page/components/cart/cart.component';
import { UserPageComponent } from './user-page/user-page.component';
import { CheckoutComponent } from './user-page/components/checkout/checkout.component';
import { DashboardComponent } from './user-page/components/dashboard/dashboard.component';
import { DashboardAdminComponent } from './admin-page/dashboard-admin.component';
import { ProfileComponent } from './user-page/components/profile/profile.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: DashboardAdminComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user-page/:username',
    component: UserPageComponent,
    children: [
      { path: 'dashboarduser', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent }, 
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: '', redirectTo: 'dashboarduser', pathMatch: 'full' }
    ]
  }
];
