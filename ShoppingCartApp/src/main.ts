import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { DashboardAdminComponent } from './app/admin/component/admin-page/dashboard-admin.component';
import { UserPageComponent } from './app/user/component/user-page/user-page.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardAdminComponent  },
      {path: 'user-page', component: UserPageComponent}

    ]),
    provideHttpClient()
  ]
});
