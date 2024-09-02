import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from './cart.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  
  private user:any;
  cartList:any[] = [];
  editForm: FormGroup;
  editItemMode = false; 
  deleteItemMode = false;
  editErrorMessage: string | null = null;
  editItemName: string = "";
  editItemQuantity: number = 0;
  userData: any;
  productsList: any[] = [];
  

  constructor(
    private router: Router,
    private http:HttpClient,
    private route:ActivatedRoute,
    private cartService : CartService,
    private fb: FormBuilder,
  ){
    // Initialize login form
    this.editForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit(){
      const username = this.route.snapshot.paramMap.get('username');
      this.user = username

      this.getCartList();
      this.getProductList();

  }

  getCartList(){
    console.log("get cart executed")

    this.cartService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.user );
      this.userData = user;
      this.cartList = user.cart;})

  }

  onSubmit(){
    // const productName = this.editForm.get('productName')?.value;
    const quantity = this.editForm.get('quantity')?.value;
    console.log("productname", this.editItemName)
    console.log("quantity", quantity)
    if (!quantity ) {
      console.log(" i went here")
      this.editErrorMessage = 'Please fill out Quantity field.';
  
      setTimeout(() => {
        this.editErrorMessage = '';
      }, 3000);

      
      return;
    }

    if (this.editForm.valid) {
      console.log("edit form valid")
      // const {quantity} = this.editForm.value;
      // console.log("quantity from form:")
      let productItem = this.cartList.find(x => x.productName === this.editItemName);
      productItem.orderQuantity = quantity;
      console.log("orderQuantity changed?: ", this.cartList)

      // let user = this.cartService.getUsers().find((u: any) => u.username === this.user)
      this.userData.cart = this.cartList;
      console.log("userid", this.userData.id);
      console.log("userData", this.userData);

      this.cartService.updateUser(this.userData).subscribe((res) => {
        this.getCartList();
        this.editItemMode = false;
      });

      
    }
  }

  editItem(item:any){
    this.editItemName = item.productName;
    this.editItemMode = true;
    this.editItemQuantity = item.orderQuantity;
  }

  cancelEdit(){
    this.editItemMode = false;
  }

  deleteItem(item:any){
    if(confirm("Are you sure to delete "+ item.productName+"?")) {
      this.cartList = this.cartList.filter(({ productName }) => productName !== item.productName);
      this.userData.cart = this.cartList;

      this.cartService.updateUser(this.userData).subscribe((res) => {
        this.getCartList();
      });

      console.log(item.productName + " deleted from cart");
    }
  }

  getProductList() {
    this.cartService.getProducts().subscribe((products: any[]) => {this.productsList = products;});
    
    }
  
  getPrice(productName: any){
    let product = this.productsList.find((p: any) => p.name === productName );
    console.log(product.price)
    console.log(product)
    return product.price
  }

  calculateSubtotal(productName: any){
    let price = this.getPrice(productName);
    let quantity = this.cartList.find(x => x.productName === productName).orderQuantity;
    return price * quantity
  }

  getTotalPayment(){
    let sum = 0;
    this.cartList.forEach( (element) => {
      sum += this.calculateSubtotal(element.productName);
  });
  return sum
  }

  }



