import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user-page.service';
import { HttpClient } from '@angular/common/http';
import { NavUserComponent } from '../../../shared/nav-user/nav-user.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavUserComponent],
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
  isShowPop = false;

  
  // Stores selected filters
  selectedCategory: string = 'all';
  selectedPriceRange: string = 'all';

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
    this.applyFilters(searchTerm);
  }

  // Filter by Category
  filterByCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.applyFilters();
  }

  // Filter by Price Range
  filterByPriceRange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPriceRange = target.value;
    this.applyFilters();
  }

  // Apply all filters (search term, category, and price range)
  applyFilters(searchTerm: string = ''): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      const matchesPriceRange = this.checkPriceRange(product.price);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesPriceRange && matchesSearch;
    });
  }

  // Helper method to check price range
  checkPriceRange(price: number): boolean {
    switch (this.selectedPriceRange) {
      case 'all':
        return true;
      case 'under10':
        return price < 10;
      case '11-25':
        return price >= 11 && price <= 25;
      case '26-50':
        return price >= 26 && price <= 50;
      case '51+':
        return price > 50;
      default:
        return true;
    }
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
    

    



    let add_product = this.cartList.find((p) => p.productName === product.name) || { productName: product.name, orderQuantity: 0 };
    add_product.orderQuantity += qty;
    
    if (add_product.orderQuantity === qty) {
      this.cartList.push(add_product);
    }

    this.userData.cart = this.cartList;
    this.userService.updateUser(this.userData).subscribe(() => {
      this.getCartList();
    });

    this.isShowPop = true;
    setTimeout(() => this.isShowPop = false, 3000);
  }

  getProductList() {
    this.userService.getProducts().subscribe((products: any[]) => {
      this.products = products;
      this.productCategories = [...new Set(products.map((obj) => obj.category))].sort();
      this.filteredProducts = [...this.products];
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
