import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currUser;
  isAdmin;
  constructor(public router: Router, public user: UserService) {}

  ngOnInit(): void {
    this.user.loggedIn$.subscribe((val) => {
      this.isLoggedIn = val;
    });

    this.user.user$.subscribe((val) => {
      this.currUser = val;
      if (
        this.isLoggedIn &&
        (this.currUser.roles.includes('SU') ||
          this.currUser.roles.includes('GA'))
      ) {
        this.isAdmin = true;
      }
    });
  }

  adminPanel() {
    this.router.navigateByUrl('/admin-panel');
  }

  dashboard() {
    console.log('clicked');
    this.router.navigateByUrl('/groups');
  }

  profile() {
    this.router.navigateByUrl('/profile');
    // console.log('logged out');
  }

  logout() {
    this.user.logout();
    // this.router.navigateByUrl('login');
  }
}
