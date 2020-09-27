import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {select, Store} from '@ngrx/store';
import {MyState} from '../models/MyState';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  auth$: Observable<MyState>;

  isAuth = false;

  constructor(private store: Store<{ auth: MyState }>,
              private authService: AuthService, private router: Router) {
    this.auth$ = store.pipe(select('auth'));

    this.auth$.subscribe((auth: MyState) => {
      this.isAuth = auth.isAuthenticated;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isAuth) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return  this.canActivate(childRoute, state);
  }
}
