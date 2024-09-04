import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Correctly import the routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // changing to route 
    provideHttpClient(withFetch())
  ]
});
