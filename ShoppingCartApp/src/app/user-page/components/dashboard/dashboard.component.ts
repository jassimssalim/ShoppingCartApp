import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  username: string | null = null;
  products: any[] = [];
  productCategories: any[] = [];
  cartList: any[] = [];
  userData: any;
  filteredProducts: any[] = [];
  quantity: { [key: string]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getProductList();
    this.getCartList();
    this.username = this.route.parent?.snapshot.params['username'] || null;
    console.log('Username in DashboardComponent:', this.username);

    setTimeout(() => {
      this.filteredProducts = [...this.products];
    }, 1000);
  }

  // Search by products
  searchProducts(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();

    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  // Filter category
  filterByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const category = target.value;

    this.filteredProducts = this.products.filter((product) =>
      category === 'all' || product.category === category
    );
  }

  // Filter price range
  filterByPriceRange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const range = target.value;

    this.filteredProducts = this.products.filter((product) => {
      switch (range) {
        case 'all':
          return true;
        case 'under10':
          return product.price < 10;
        case '11-25':
          return product.price >= 11 && product.price <= 25;
        case '26-50':
          return product.price >= 26 && product.price <= 50;
        case '51+':
          return product.price > 50;
        default:
          return true;
      }
    });
  }

  // Sort products based on name
  sortByName(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const sortOrder = target.value;

    this.filteredProducts = this.filteredProducts.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }

  addToCart(product: { id: string; name: string; category: string; price: number }): void {
    const qty = this.quantity[product.id] || 1;
    console.log(`Adding ${qty} of ${product.name} to cart.`);
    alert("You added your quantity please check at my cart.");

    let add_product = this.cartList.find((p) => p.productName === product.name) || { productName: product.name, orderQuantity: 0 };
    add_product.orderQuantity += qty;

    if (add_product.orderQuantity === qty) {
      this.cartList.push(add_product);
    }

    this.userData.cart = this.cartList;
    this.userService.updateUser(this.userData).subscribe(() => {
      this.getCartList();
    });
  }

  getProductList() {
    this.userService.getProducts().subscribe((products: any[]) => {
      this.products = products;
      this.productCategories = [...new Set(products.map((obj) => obj.category))].sort();
      this.filteredProducts = [...this.products]; // Initialize filteredProducts
    });
  }

  getCartList() {
    this.userService.getUsers().subscribe((users: any[]) => {
      const user = users.find((u) => u.username === this.username);
      if (user) {
        this.userData = user;
        this.cartList = user.cart;
      }
    });
  }
}
