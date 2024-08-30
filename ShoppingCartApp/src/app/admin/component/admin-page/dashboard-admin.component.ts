import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

}
