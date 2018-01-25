import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingStatusService } from './loading-status.service';

@Injectable()
export class UserAuthentication implements CanActivate {
  static loggedIn = false;

  constructor(private router: Router, private loadingStatusService: LoadingStatusService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (UserAuthentication.loggedIn) {
      this.loadingStatusService.stopLoading();
      return true;
    } else {
      this.router.navigate([ 'login' ]);
      return false;
    }
  }
}
