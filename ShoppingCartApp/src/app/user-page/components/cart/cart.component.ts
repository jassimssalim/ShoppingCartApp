import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from './cart.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../../shared/footer/footer.component';



import { NavUserComponent } from '../../../shared/nav-user/nav-user.component';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, NavUserComponent,FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] 
})
export class CartComponent implements OnInit {
  username: string | null = null;
  userData: any;
  cartList: any[] = [];
  productsList: any[] = [];
  checkoutDisabled: boolean = true;
  editForm: FormGroup;
  editItemMode = false; 
  editErrorMessage: string | null = null;
  editItemName: string = "";
  editItemQuantity: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username');
      console.log('Username in cart:', this.username);
      this.getCartList();
      this.getProductList();    
    });
  }

  getCartList() {
    console.log("getCartList executed");

    this.cartService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.username);
      if (user) {
        this.userData = user;
        this.cartList = user.cart || [];
        this.checkoutDisabled = this.cartList.length === 0;
      }
    });
  }

  onSubmit() {
    const quantity = this.editForm.get('quantity')?.value;
    console.log("product name:", this.editItemName);
    console.log("quantity:", quantity);

    if (!quantity) {
      this.editErrorMessage = 'Please fill out the Quantity field.';

      setTimeout(() => {
        this.editErrorMessage = null;
      }, 3000);
      return;
    }

    if (this.editForm.valid) {
      console.log("edit form valid");

      let productItem = this.cartList.find(x => x.productName === this.editItemName);
      if (productItem) {
        productItem.orderQuantity = quantity;
        this.userData.cart = this.cartList;

        this.cartService.updateUser(this.userData).subscribe(() => {
          this.getCartList();
          this.editItemMode = false;
        });
      }
    }
  }

  editItem(item: any) {
    this.editItemName = item.productName;
    this.editItemMode = true;
    this.editItemQuantity = item.orderQuantity;
  }

  cancelEdit() {
    this.editItemMode = false;
  }

  deleteItem(item: any) {
    if (confirm("Are you sure you want to delete " + item.productName + "?")) {
      this.cartList = this.cartList.filter(({ productName }) => productName !== item.productName);
      this.userData.cart = this.cartList;

      this.cartService.updateUser(this.userData).subscribe(() => {
        this.getCartList();
      });

      console.log(item.productName + " deleted from cart");
    }
  }

  getProductList() {
    this.cartService.getProducts().subscribe((products: any[]) => {
      this.productsList = products;
    });
  }

  getPrice(productName: string) {
    let product = this.productsList.find((p: any) => p.name === productName);
    return product ? product.price : 0;
  }

  calculateSubtotal(productName: string) {
    let price = this.getPrice(productName);
    let quantity = this.cartList.find(x => x.productName === productName)?.orderQuantity || 0;
    return price * quantity;
  }

  getTotalPayment() {
    return this.cartList.reduce((sum, item) => sum + this.calculateSubtotal(item.productName), 0);
  }

  trackByProductName(index: number, item: any): string {
    return item.productName;
  }

  goToCheckout(event?: Event): void {
    if (event) event.preventDefault();
    this.router.navigate(['/user-page', this.username, 'checkout']);
  }
}
