import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {MatOAuthSecurityService} from 'projects/mat-oauth-security/src/lib/mat-oauth-security.service';

@Injectable({
  providedIn: 'root'
})
export class MatOAuthSecurityGuardGuard implements CanActivate {
  constructor(private router: Router, private service: MatOAuthSecurityService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(next) && this.authorize(next);
  }
  authenticate(next: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    if (this.service.token && this.service.token.accessToken) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: next.url } });
    return false;
  }
  authorize(next: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    const permission: string = next.data && next.data.hasOwnProperty('permission') ? next.data.permissions : null;
    const hasRead: boolean = this.service.read(permission);
    if (!hasRead) {
      console.log('Access denied');
    }
    return hasRead;
  }
}
