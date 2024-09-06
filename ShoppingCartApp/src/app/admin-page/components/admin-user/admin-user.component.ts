import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, User} from '../../services/admin.service';
import { map } from 'rxjs';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule,FooterComponent, AdminHeaderComponent],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements OnInit{
  userData: User [] = [];
  paginatedUsers: User [] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
constructor(private userService: AdminService){}

ngOnInit(): void {
    this.getUsers()
}

getUsers(): void {
  this.userService.getUsers().pipe(
    map((data: User[]) => 
      data
        .filter(user => !user.isAdmin)
    )
  ).subscribe(filteredUsers => {
    this.userData = filteredUsers; 
    this.updatePaginatedUsers(); 
  });
}

updatePaginatedUsers(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedUsers = this.userData.slice(startIndex, endIndex);
}

goToNextPage(): void {
  if (this.hasNextPage) {
    this.currentPage++;
    this.updatePaginatedUsers();
  }
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedUsers();
  }
}

get hasNextPage(): boolean {
  return this.userData.length > this.currentPage * this.itemsPerPage;
}

deactivateUser(userId: any): void {
  this.userService.deactivateUser(userId).subscribe({
    next: () => {
      this.userData = this.userData.map(user =>
        user.id === userId ? { ...user, status: "Inactive" } : user
      );
      console.log("User has been deactivated successfully")
      alert("User has been deactivated successfully!")
      this.ngOnInit()
    },
    error: (error) => {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user, Please try again later!')
    }
  });
}

}
