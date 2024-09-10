import { Component } from '@angular/core';
import { UserService } from '../../user-page.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavUserComponent } from '../../../shared/nav-user/nav-user.component';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, RouterModule, NavUserComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {


  username: any; 
  cartList: any[] = [];
  pendingList: any[] = [];
  productsList: any[] = [];
  userData: any;


  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private checkoutService: UserService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username');
      console.log('Username in checkout:', this.username);
      this.getCartList();
      this.getProductList();    
      this.getPendingList();
    });

  }

  getCartList() {

    this.checkoutService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.username);
      this.userData = user;
      this.cartList = user.cart;
    });
  }


  getPendingList() {

    this.checkoutService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.username);
      this.pendingList = user.pendingOrders;
    });
  }


  getProductList() {
    this.checkoutService.getProducts().subscribe((products: any[]) => {
      this.productsList = products;
    });
  }


  trackById(index: number, item: any): any {
    return item.id;
  }

  trackByProductName(index: number, item: any): string {
    return item.productName;
  }


}
