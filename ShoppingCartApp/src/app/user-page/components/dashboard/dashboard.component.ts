import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { UserService } from '../../user-page.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string | null = null; // Declare username property
  // products = [
  //   { id: '1', name: 'Product 1', category: 'electronics', price: 10 },
  //   { id: '2', name: 'Product 2', category: 'clothing', price: 25 },
  //   { id: '3', name: 'Product 3', category: 'test', price: 50 }
  // ];
  products: any[] = [];
  productCategories: any[] = [];
  cartList: any[] = [];
  userData: any;

  // filteredProducts = [...this.products];
  filteredProducts: any[] = [];
  quantity: { [key: string]: number } = {}; // Stores quantity for each product

  constructor(
    private route: ActivatedRoute, // Inject ActivatedRoute
    private userService: UserService, // Inject UserService
    private http: HttpClient,
  ) {}

  ngOnInit() {
    
    // Retrieve the username from the route parameters
    this.getProductList();
    this.getCartList();

    this.username = this.route.parent?.snapshot.params['username'] || null;
    console.log('Username in DashboardComponent:', this.username); 
    
    setTimeout(() => {
      this.filteredProducts = [...this.products];
    }, 1000);
    
  }

  filterByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const category = target.value;

    // Filter products based on category
    this.filteredProducts = this.products.filter(product =>
      category === 'all' || product.category === category
    );
  }

  filterByPriceRange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const range = target.value;

    // Filter products based on price range
    this.filteredProducts = this.products.filter(product => {
      if (range === 'all') return true;

      const [min, max] = range.split('-').map(Number);
      return product.price >= min && (max ? product.price <= max : true);
    });
  }

  addToCart(product: { id: string, name: string, category: string, price: number }): void {
    const qty = this.quantity[product.id] || 1;
    console.log(`Adding ${qty} of ${product.name} to cart.`);
    // You might want to implement the actual logic to add the product to the cart here
    console.log("oldcart:", this.cartList);
    let add_product = this.cartList.find((p) => p.productName === product.name) || {"productName": product.name,"orderQuantity": 0};
    console.log(add_product);
    add_product.orderQuantity += qty;

    if (add_product.orderQuantity == qty) {
      this.cartList.push(add_product)
    }

    this.userData.cart = this.cartList;

    this.userService.updateUser(this.userData).subscribe(() => {
      this.getCartList();
    });
   
  }

  getProductList() {
    this.userService.getProducts().subscribe((products: any[]) => {
      this.products = products;
      this.productCategories = [...new Set( products.map(obj => obj.category)) ].sort();

    });

  }

  getCartList() {

    this.userService.getUsers().subscribe((users: any[]) => {
      const user = users.find(u => u.username === this.username);
      this.userData = user;
      this.cartList = user.cart;
    });
  }
}
