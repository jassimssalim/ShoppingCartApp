import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { UserPageComponent } from './app/user-page/user-page.component';
import { DashboardComponent } from './app/user-page/components/dashboard/dashboard.component';
import { CartComponent } from './app/user-page/components/cart/cart.component';
import { CheckoutComponent } from './app/user-page/components/checkout/checkout.component';
import { DashboardAdminComponent } from './app/admin-page/dashboard-admin.component';
import { ProfileComponent } from './app/user-page/components/profile/profile.component';
import { routes } from './app/app.routes'; // Correctly import the routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // changing to route 
    provideHttpClient(withFetch())
  ]
});
