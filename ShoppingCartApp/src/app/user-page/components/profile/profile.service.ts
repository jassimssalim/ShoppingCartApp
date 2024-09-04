import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  
  private apiUrl = 'http://localhost:3000/users';
  private currentUserId: string | null = null;

  constructor(private http: HttpClient) {}

  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string | null {
    
    return this.currentUserId;
  }

  fetchUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  fetchUserByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, userData);
  }
}