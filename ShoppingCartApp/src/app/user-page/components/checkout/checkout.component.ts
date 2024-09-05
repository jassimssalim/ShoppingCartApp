import { Component } from '@angular/core';
import { UserService } from '../../user-page.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  username: any; 
  cartList: any[] = [];
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
    });
    // const username = this.route.snapshot.paramMap.get('username');
    // this.username = username;
    // console.log("username at checkout:",username)

    // this.getCartList();
    // this.getProductList();
  }

  getCartList() {

    this.checkoutService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.username);
      this.userData = user;
      this.cartList = user.cart;
    });
  }


  getProductList() {
    this.checkoutService.getProducts().subscribe((products: any[]) => {
      this.productsList = products;
    });
  }

  getPrice(productName: string) {
    let product = this.productsList.find((p: any) => p.name === productName);
    return product ? product.price : 0;
  }

  calculateSubtotal(productName: string) {
    let price = this.getPrice(productName);
    let quantity = this.cartList.find(x => x.productName === productName).orderQuantity;
    return price * quantity;
  }

  getTotalPayment() {
    return this.cartList.reduce((sum, item) => sum + this.calculateSubtotal(item.productName), 0);
  }

  trackByProductName(index: number, item: any): string {
    return item.productName;
  }

  confirmOrder() {
    if (confirm("Confirm order?")) {

      for (let index = 0; index < this.cartList.length; index++) {
        const element = this.cartList[index];
        let product = this.productsList.find((p: any) => p.name === element.productName);
        product.quantitySold += element.orderQuantity;     

        this.checkoutService.updateProduct(product).subscribe(() => {
          this.getProductList();
        });
      }

      let json_put = {"items": this.cartList};
      let empty_cart: any[]= [];
      
      this.userData.cart = empty_cart;
      this.userData.pendingOrders.push(json_put);
      console.log(this.userData);

      this.checkoutService.updateUser(this.userData).subscribe(() => {
        this.getCartList();
      });

      console.log("Cart transferred to pending orders");
      alert("Thank you for your order!");
      this.router.navigate(['/user-page', this.username]);
    }
  }

}
