import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'chatApp';

  constructor(public router: Router, public user: UserService) {
    console.log('app component');
  }

  ngOnInit(): void {
    //Navigate according to login status
    this.user.loggedIn$.subscribe((val) => {
      // console.log(val);
      if (val) this.router.navigateByUrl('groups');
      else this.router.navigateByUrl('login');
    });
  }
}
