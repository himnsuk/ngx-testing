import { Component } from '@angular/core';
import { UserAuthentication } from '../user-authentication.service';
import { Router } from '@angular/router';
import { LoadingStatusService } from '../loading-status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {

  login() {
    this.loadingService.startLoading();
    setTimeout(() => {
      UserAuthentication.loggedIn = true;
      this.router.navigate([ 'dashboard' ]);
    }, 500);
  }

  constructor(private router: Router, private loadingService: LoadingStatusService) {
  }

}
