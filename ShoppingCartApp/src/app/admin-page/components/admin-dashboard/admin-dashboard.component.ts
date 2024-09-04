import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent, AdminHeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
