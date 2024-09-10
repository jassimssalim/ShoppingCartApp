import { Component, OnInit } from '@angular/core';
import { AdminService, Product } from '../../services/admin.service';
import { CommonModule, } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule,FooterComponent, AdminHeaderComponent],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements OnInit{
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  constructor(private productService: AdminService, private router: Router){}

  ngOnInit(): void {
      this.getProducts()
  }

  getProducts(): void{
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.updatePaginatedProducts();
    }
    );
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  get hasNextPage(): boolean {
    return this.products.length > this.currentPage * this.itemsPerPage;
  }

  onAdd(): void{
    this.router.navigate(['/product-form'])
  }
  
  onEdit(product: Product): void{
    this.router.navigate(['/product-form'], { queryParams: { id: product.id } })
  }

  onDelete(product: Product) {
    this.productService.deleteProduct(product.id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== product.id);
        alert('Product has been deleted');
        this.ngOnInit();
      },
      (error) => {
        alert('Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
      }
    );
  }
}
