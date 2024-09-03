import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../user-page.service'; // Adjust path if needed

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string | null = null; // Declare username property
  products = [
    { id: '1', name: 'Product 1', category: 'electronics', price: 10 },
    { id: '2', name: 'Product 2', category: 'clothing', price: 25 },
    { id: '3', name: 'Product 3', category: 'test', price: 50 } // Fixed duplicate id
  ];

  filteredProducts = [...this.products];
  quantity: { [key: string]: number } = {}; // Stores quantity for each product

  constructor(private userService: UserService) {} // Inject UserService

  ngOnInit() {
    this.username = this.userService.getUser(); // Retrieve the username here
    console.log('Username in DashboardComponent:', this.username); // Debugging statement
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
  }
}
