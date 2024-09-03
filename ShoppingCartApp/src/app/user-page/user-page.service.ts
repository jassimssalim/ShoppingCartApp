import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username: string | null = null; // This should be initialized or set somewhere

  setUser(user: string): void {
    this.username = user;
  }

  getUser(): string | null {
    return this.username ;
  }
}
