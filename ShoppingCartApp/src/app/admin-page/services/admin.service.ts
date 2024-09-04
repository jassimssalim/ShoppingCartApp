import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product{
  id? : any,
  name: string,
  description: string,
  price: number,
  category: string,
  quantitySold: number
}

export interface User{
  id?: any
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string,
  isAdmin: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private productUrl = 'http://localhost:3000/products'
  private userUrl = 'http://localhost:3000/users'

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.userUrl)
  }

  deactivateUser(userId: any): Observable<void> {
    return this.http.patch<void>(`${this.userUrl}/${userId}`, { status: "Inactive" });
  }

  getProducts (): Observable<Product[]>{
    return this.http.get<Product[]>(this.productUrl)
  }

  getProductById(id: any): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  addProduct(product: Product) {
    return this.http
      .post(this.productUrl, product)
  }

  updateProduct(product: Product) {
    return this.http
      .put(`${this.productUrl}/${product.id}`, product)
  }

  deleteProduct(id: any) {
    return this.http
      .delete(`${this.productUrl}/${id}`)
  }
}
