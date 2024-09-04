import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, Product } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent, AdminHeaderComponent],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit{
productForm: FormGroup;
productId: any | null = null;
products: Product[] = [];
isUpdateMode: boolean = false;

  constructor(private fb: FormBuilder, private productService: AdminService,
    private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar
  ){
    this.productForm = this.fb.group({
      id: this.generateId(),
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category: ['', [Validators.required]],
      quantitySold: 0
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.isUpdateMode = true;
        this.loadProduct(this.productId);
        }
      }
    )
  }

  addProduct(newProduct: Product) {
    this.productService.addProduct(newProduct).subscribe(
      (newProduct) => {
        console.log(newProduct);
        this.productForm.reset(); // Clear form fields
      },
      error => {
        console.error('Error adding product', error);
      }
    );
  }

  updateProduct(updatedProduct: Product) {
    this.productService.updateProduct(updatedProduct).subscribe(
      (updatedProduct) => {
        console.log(updatedProduct);
        this.productForm.reset(); 
      },
      error => {
        console.error('Error updating product', error);
      }
    );
  }

  generateId(): string {
    return Math.floor(Math.random() * 1000).toString()
  }

  onSubmit= () =>{
    if (this.productForm.valid) {
      const value: Product = this.productForm.value;
      if(this.isUpdateMode){
        this.updateProduct(value)
      }else{
      this.addProduct(value);
      }
    }
  }

  loadProduct = (id: any) => {
    this.productService.getProductById(id).subscribe(data => {
      if (data) {
        this.productForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          quantitySold: data.quantitySold
            }
          )
        }
      }
    )
  }

  back(): void{
    this.router.navigate(['/admin-page/admin-product'])
  }
}
