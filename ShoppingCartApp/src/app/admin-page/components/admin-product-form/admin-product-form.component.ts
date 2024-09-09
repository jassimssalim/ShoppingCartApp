import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, Product } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
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
    private route: ActivatedRoute, private router: Router
  ){
    this.productForm = this.fb.group({
      id: this.generateId(),
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category: ['', [Validators.required]],
      quantitySold: 0
    }, { validator: this.checkDuplicateName() });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.isUpdateMode = true;
        this.loadProduct(this.productId);
        }
      }
    );
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addProduct(newProduct: Product) {
    this.productService.addProduct(newProduct).subscribe(
      (newProduct) => {
        console.log(newProduct);
        this.productForm.reset(); // Clear form fields
        alert('Product added successfully!');
      },
      error => {
        console.error('Error adding product', error);
        alert('There was an error adding the product. Please try again.');
      }
    );
  }

  updateProduct(updatedProduct: Product) {
    this.productService.updateProduct(updatedProduct).subscribe(
      (updatedProduct) => {
        console.log(updatedProduct);
        this.productForm.reset(); 
        alert('Product updated successfully!');
      },
      error => {
        console.error('Error updating product', error);
        alert('There was an error updating the product. Please try again.');
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

  checkDuplicateName() {
    return (formGroup: FormGroup) => {
      const nameControl = formGroup.get('name');
      if (nameControl) {
        const name = nameControl.value.toLowerCase();
        const isDuplicate = this.products.some(
          (product) => product.name.toLowerCase() === name && product.id !== this.productId
        );
        
        if (isDuplicate) {
          nameControl.setErrors({ duplicateName: true });
        } else {
          nameControl.setErrors(null);
        }
      }
    };
  }
  back(): void{
    this.router.navigate(['/admin-page/admin-product'])
  }
}
