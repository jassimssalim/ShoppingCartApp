import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  errorMessage: string | null = null;
  forgotPasswordErrorMessage: string | null = null;
  isLoginMode = true; 
  isShowPop = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Initialize forgot password form with email and phone number fields
    this.forgotPasswordForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  // Submit handler for the login form
  onSubmit(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (!username || !password) {
      this.forgotPasswordErrorMessage = 'Please fill out all fields.';
  
      setTimeout(() => {
        this.forgotPasswordErrorMessage = '';
      }, 3000);

      return;
    }

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          if (user.isAdmin) {
            this.router.navigate(['/dashboard-admin']); // Redirect to the dashboard if the user is an admin
          } else {
            this.router.navigate(['/user-page', username]); // Redirect to the product page if the user is not an admin
          }
        } else {
          this.errorMessage = 'Invalid username or password';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      }, error => {
        this.errorMessage = 'An error occurred. Please try again later.';
      });
    }
  }

  // Submit handler for the forgot password form
  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const { username, email, phone, newPassword } = this.forgotPasswordForm.value;

      this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
        const user = users.find(u => u.username === username && u.email === email && u.phone === phone);
        if (user) {
          user.password = newPassword;

          this.http.put(`http://localhost:3000/users/${user.id}`, user).subscribe(
            () => {
              this.isShowPop = true;
              this.switchToLogin();
              this.cdr.detectChanges(); // Force view update

              setTimeout(() => {
                this.isShowPop = false;
              }, 3000);
            },
            error => {
              this.forgotPasswordErrorMessage = 'Failed to reset password. Please try again later.';
              console.error('Update failed', error);
              setTimeout(() => {
                this.forgotPasswordErrorMessage = '';
              }, 3000);
            }
          );
        } else {
          this.forgotPasswordErrorMessage = 'No matching user found with the provided details.';
          setTimeout(() => {
            this.forgotPasswordErrorMessage = '';
          }, 3000);
        }
      }, error => {
        this.forgotPasswordErrorMessage = 'An error occurred. Please try again later.';
      });
    } else {
      this.forgotPasswordErrorMessage = 'Please fill out all fields correctly.';
      setTimeout(() => {
        this.forgotPasswordErrorMessage = '';
      }, 3000);
    }
  }

  // Switch to the forgot password form
  switchToForgotPassword(event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.isLoginMode = false;
    this.errorMessage = null; // Clear previous errors
  }

  // Switch back to the login form
  switchToLogin(event?: Event): void {
    if (event) event.preventDefault(); // Prevent default anchor behavior if event is present
    this.isLoginMode = true;
    this.forgotPasswordErrorMessage = null; // Clear previous errors
  }

  // Redirect to the register page
  goToRegister(event?: Event): void {
    if (event) event.preventDefault();
    //event.preventDefault();
    //this.isLoginMode = true;
    this.router.navigate(['/register']);
  }
}
