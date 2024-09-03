import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { UserPageComponent } from './app/user-page/user-page.component';
import { DashboardComponent } from './app/user-page/components/dashboard/dashboard.component';
import { CartComponent } from './app/user-page/components/cart/cart.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'user-page/:username',
        component: UserPageComponent,
        children: [
          { path: '', component: DashboardComponent }  // Default child route
        ]
      },
      { path: 'user-page/cart/:username', component: CartComponent }
    ]),
    provideHttpClient(withFetch())
  ]
});
