import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'] 
})
export class UserPageComponent implements OnInit {

  public user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    this.user = username;

    console.log('passing username:', username);
  }


  // Redirect to the cart page
  goToUserCart(event?: Event): void {
    if (event) event.preventDefault();
    this.router.navigate(['/user-page/cart', this.user]);
  }

  goToProfile(event?: Event): void {
    if (event) event.preventDefault();
    //event.preventDefault();
    //this.isLoginMode = true;
    this.router.navigate(['/user-page/profile', this.user]);
  }
}
