import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient , HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      isAdmin: [false],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { username, email, phone, password, confirmPassword, isAdmin } = this.registerForm.value;

      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.generateId().then(newId => {
        const userData = {
          id: newId,
          username,
          password,
          email,
          phone,
          isAdmin,
        };
        this.registerUser(userData);
      }).catch(error => {
        this.errorMessage = 'Failed to generate user ID.';
        console.error('Error generating ID', error);
      });
    }

registerUser(userData: any): void {
    this.http.post('http://localhost:3000/users', userData).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.errorMessage = null; 
        alert('Registration successful!');
        this.router.navigate(['']); 
      },
      error => {
        this.errorMessage = 'Failed to register user. Please try again.';
        console.error('Error registering user', error);
      }
    );
  }
    

  generateId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:3000/users').subscribe(
        users => {
          const maxId = users.reduce((max, user) => Math.max(max, +user.id), 0);
          const newId = (maxId + 1).toString();
          resolve(newId);
        },
        error => {
          reject(error);
        }
      );
    });
  }
}