import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Ensure ReactiveFormsModule and CommonModule are imported
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  errorMessage: string | null = null;
  forgotPasswordErrorMessage: string | null = null;
  isLoginMode = true; // Flag to switch between login and forgot password forms

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
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


//clicking login when empty
  const username = this.loginForm.get('username')?.value;
  const password = this.loginForm.get('password')?.value;
  if (!username && !password) {
   // alert('Please enter both username and password.');
    this.forgotPasswordErrorMessage = 'Please fill out all fields correctly.';
    return;
  }

    //login form
    if (this.loginForm.valid) {
      
      const { username, password } = this.loginForm.value;

      this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          if (user.isAdmin) {
            this.router.navigate(['/dashboard']); // Redirect to the dashboard if the user is an admin
          } else {
            this.router.navigate(['/user-page']); // Redirect to the product page if the user is not an admin
          }
        } else {
          this.errorMessage = 'Invalid username or password';
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
              alert('Password reset successful!');
              this.switchToLogin();
            },
            error => {
              this.forgotPasswordErrorMessage = 'Failed to reset password. Please try again later.';
            }
          );
        } else {
          this.forgotPasswordErrorMessage = 'No matching user found with the provided details.';
        }
      }, error => {
        this.forgotPasswordErrorMessage = 'An error occurred. Please try again later.';
      });
    } else {
      this.forgotPasswordErrorMessage = 'Please fill out all fields correctly.';
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
}
