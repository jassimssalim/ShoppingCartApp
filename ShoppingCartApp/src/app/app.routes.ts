import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './user-page/components/cart/cart.component';
import { UserPageComponent } from './user-page/user-page.component';
import { DashboardComponent } from './user-page/components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent 
    },
    {
        path: 'user-page/:username',
        component:UserPageComponent
    },
    {
        path: 'user-page/:username',
        component: UserPageComponent,
        children: [
            { path: '', component: DashboardComponent } 
        ]
    },
    {
        path: 'user-page/cart/:username',
        component:CartComponent
    }
    

];
