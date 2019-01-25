import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  patreonRedirect() {
    window.open('https://www.patreon.com/user?u=2377969', '_blank');
  }

}
