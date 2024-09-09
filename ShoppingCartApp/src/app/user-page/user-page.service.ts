import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username: string | null = null; 
  constructor(private http: HttpClient) { }

  setUser(user: string): void {
    this.username = user;
  }

  getUser(): string | null {
    return this.username ;
  }

  getUsers():any {
    return this.http.get<any[]>('http://localhost:3000/users')
  }
     
  getProducts():any{
    return this.http.get<any[]>('http://localhost:3000/products')
  }

  updateUser(user:any){
    return this.http.put(`http://localhost:3000/users/${user.id}`, user)
  }

  updateProduct(product:any){
    return this.http.put(`http://localhost:3000/products/${product.id}`, product)
  }

}
