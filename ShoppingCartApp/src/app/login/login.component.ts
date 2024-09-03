import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { ProfileService } from '../user-page/components/profile/profile.service';
import { UserService } from '../user-page/user-page.service';

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
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
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

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out all fields.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        // Set the username in the UserService
        this.userService.setUser(username);

        // Redirect based on user role
        if (user.isAdmin) {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/user-page', username]);
        }
      } else {
        this.errorMessage = 'Invalid username or password';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    }, error => {
      this.errorMessage = 'An error occurred. Please try again later.';
      setTimeout(() => this.errorMessage = '', 3000);
    });
  }

  // Submit handler for the forgot password form
  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordErrorMessage = 'Please fill out all fields correctly.';
      setTimeout(() => this.forgotPasswordErrorMessage = '', 3000);
      return;
    }

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

            setTimeout(() => this.isShowPop = false, 3000);
          },
          error => {
            this.forgotPasswordErrorMessage = 'Failed to reset password. Please try again later.';
            console.error('Update failed', error);
            setTimeout(() => this.forgotPasswordErrorMessage = '', 3000);
          }
        );
      } else {
        this.forgotPasswordErrorMessage = 'No matching user found with the provided details.';
        setTimeout(() => this.forgotPasswordErrorMessage = '', 3000);
      }
    }, error => {
      this.forgotPasswordErrorMessage = 'An error occurred. Please try again later.';
      setTimeout(() => this.forgotPasswordErrorMessage = '', 3000);
    });
  }

  // Switch to the forgot password form
  switchToForgotPassword(event: Event): void {
    event.preventDefault();
    this.isLoginMode = false;
    this.errorMessage = null;
  }

  // Switch back to the login form
  switchToLogin(event?: Event): void {
    if (event) event.preventDefault();
    this.isLoginMode = true;
    this.forgotPasswordErrorMessage = null;
  }

  // Redirect to the register page
  goToRegister(event?: Event): void {
    if (event) event.preventDefault();
    this.router.navigate(['/register']);
  }
}
