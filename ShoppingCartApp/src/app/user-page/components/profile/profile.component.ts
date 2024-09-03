import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userData: any;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [''],
      interest: [''],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const currentUserId = this.profileService.getCurrentUserId();
    if (currentUserId) {
      this.profileService.fetchUserById(currentUserId).subscribe(
        (user) => {
          this.userData = user;
          this.populateProfileForm();
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
    } else {
      console.error('No user ID is set');
    }
  }

  populateProfileForm(): void {
    if (this.userData) {
      this.profileForm.patchValue({
        username: this.userData.username,
        firstName: this.userData.firstName,
        middleName: this.userData.middleName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        birthDate: this.userData.birthDate,
        interest: this.userData.interest,
      });
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      const userData = { ...this.userData, ...updatedData };

      this.profileService.updateUser(this.userData.id, userData).subscribe(
        (response) => {
          console.log('User data updated successfully', response);
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error('Error updating user data', error);
        }
      );
    }
  }
}