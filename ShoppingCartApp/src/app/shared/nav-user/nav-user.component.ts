import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user-page/user-page.service';

@Component({
  selector: 'app-nav-user',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './nav-user.component.html',
  styleUrl: './nav-user.component.css'
})
export class NavUserComponent {
  username: string | null = null;  // Holds the username

  constructor(
    
    private route: ActivatedRoute,

    
  
  ) { }  

  ngOnInit(): void {
    this.username = this.route.parent?.snapshot.params['username'] || null;
    // Retrieve the username from the service
  }
}

