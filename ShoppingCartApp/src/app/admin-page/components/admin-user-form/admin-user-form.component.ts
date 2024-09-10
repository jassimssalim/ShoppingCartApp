import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule, FooterComponent, AdminHeaderComponent],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.css'
})
export class AdminUserFormComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      isAdmin: [false],
      cart: [],
      pendingOrders: [],
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: [new Date().toISOString().split('T')[0]], 
      interest: "",
      status: "Active"
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => (this.errorMessage = null), 3000);
      return;
    }

    const {
      username,
      email,
      phone,
      password,
      confirmPassword,
      isAdmin,
      cart,
      pendingOrders,
      firstName,
      middleName,
      lastName,
      birthDate,
      interest,
      status,
    } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      setTimeout(() => (this.errorMessage = null), 3000);
      return;
    }

    this.checkUsernameUnique(username).then((isUnique) => {
      if (!isUnique) {
        this.errorMessage = 'Username already exists. Please choose a different one.';
        setTimeout(() => (this.errorMessage = null), 3000);
        return;
      }

      this.generateId()
        .then((newId) => {
          const userData = {
            id: newId,
            username,
            password,
            email,
            phone,
            isAdmin,
            cart: [],
            pendingOrders: [],
            firstName,
            middleName,
            lastName,
            birthDate,
            interest,
            status,
          };
          this.registerUser(userData);
        })
        .catch((error) => {
          this.errorMessage = 'Failed to generate user ID.';
          console.error('Error generating ID', error);
        });
    });
  }

  checkUsernameUnique(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:3000/users').subscribe(
        (users) => {
          const userExists = users.some((user) => user.username === username);
          resolve(!userExists);
        },
        (error) => {
          this.errorMessage = 'Failed to check username uniqueness.';
          console.error('Error checking username', error);
          reject(error);
        }
      );
    });
  }

  registerUser(userData: any): void {
    this.http.post('http://localhost:3000/users', userData).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        this.errorMessage = null;
        alert('Registration successful!');
        this.registerForm.reset()
      },
      (error) => {
        this.errorMessage = 'Failed to register user. Please try again.';
        console.error('Error registering user', error);
      }
    );
  }

  generateId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:3000/users').subscribe(
        (users) => {
          const maxId = users.reduce((max, user) => Math.max(max, +user.id), 0);
          const newId = (maxId + 1).toString();
          resolve(newId);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  back(): void{
    this.router.navigate(['/admin-page/admin-user'])
  }

}
