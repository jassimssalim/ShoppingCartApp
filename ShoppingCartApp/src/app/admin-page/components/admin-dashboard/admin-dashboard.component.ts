import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
import { AdminService, Product } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent, AdminHeaderComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  topProducts: Product[] = [];

  constructor(private productService: AdminService){}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.topProducts = products
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5);
    });
  }

}
