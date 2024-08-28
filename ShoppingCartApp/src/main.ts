import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { DashboardComponent } from './app/dashboard-admin/dashboard.component';
import { ProductPageComponent } from './app/product-page/product-page.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent  },
      {path: 'product-page', component: ProductPageComponent}

    ]),
    provideHttpClient()
  ]
});
