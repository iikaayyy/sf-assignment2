import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  email = '';

  currMode = 'login';

  constructor(public router: Router, public user: UserService) {
    console.log('login component');
  }

  login() {
    if (this.currMode === 'login') {
      this.user.validateLogin(this.username, this.password).subscribe((res) => {
        if (res.valid) {
          this.user.setUser(res.user); //setting user in local storage
          this.router.navigateByUrl('groups');
        } else
          alert(`Incorrect credentials/user doesn't exist. Please try again!`);
      });
    } else if (this.currMode === 'signup') {
      if (this.email && this.password && this.username)
        this.user
          .signUp(this.email, this.username, this.password)
          .subscribe((val) => {
            console.log(val);
          });
    }

    this.username = this.password = this.email = '';
  }

  switchMode() {
    this.currMode = this.currMode === 'login' ? 'signup' : 'login';
  }
}
