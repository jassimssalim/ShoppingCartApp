import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './user-page/components/cart/cart.component';
import { UserPageComponent } from './user-page/user-page.component';
import { CheckoutComponent } from './user-page/components/checkout/checkout.component';
import { DashboardComponent } from './user-page/components/dashboard/dashboard.component';
import { ProfileComponent } from './user-page/components/profile/profile.component';
import { AdminDashboardComponent } from './admin-page/components/admin-dashboard/admin-dashboard.component';
import { AdminProductComponent } from './admin-page/components/admin-product/admin-product.component';
import { AdminUserComponent } from './admin-page/components/admin-user/admin-user.component';
import { AdminProductFormComponent } from './admin-page/components/admin-product-form/admin-product-form.component';
import { DashboardAdminComponent } from './admin-page/dashboard-admin.component';
import { LoginComponent } from './login/login.component';
import { PendingComponent } from './user-page/components/pending/pending.component';
import { AdminUserFormComponent } from './admin-page/components/admin-user-form/admin-user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user-page/:username',
    component: UserPageComponent,
    children: [
      { path: 'dashboarduser', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent }, 
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'pending', component: PendingComponent },
      { path: '', redirectTo: 'dashboarduser', pathMatch: 'full' }
    ]
  },
  { path: 'admin-page', 
    component: DashboardAdminComponent,
    children: [
      { path: 'admin-product', component: AdminProductComponent},
      { path: 'admin-user', component: AdminUserComponent},
      { path: 'admin-dashboard', component: AdminDashboardComponent }, 
      { path: 'admin-dashboard', component: AdminDashboardComponent }, 
      { path: 'admin-user-form', component: AdminUserFormComponent },
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' } 
    ]
  },
  { path: 'product-form', component: AdminProductFormComponent}
]
