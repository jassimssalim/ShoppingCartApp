import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }


  getUsers():any {
    return this.http.get<any[]>('http://localhost:3000/users')
  }
     
  getProducts():any{
    return this.http.get<any[]>('http://localhost:3000/products')
  }

  updateUser(user:any){
    return this.http.put(`http://localhost:3000/users/${user.id}`, user)
  }
}
