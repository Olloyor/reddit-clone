import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {logout} from '../store/auth.actions';
import {UserResponse} from '../models/user-profile.payload';
import {MyState} from '../models/MyState';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  auth$: Observable<MyState>;
  isAuth = false;
  user: UserResponse;

  constructor(private router: Router, private store: Store<{ auth: MyState }>, private authService: AuthService) {
    this.auth$ = store.pipe(select('auth'));
    this.auth$.subscribe((auth) => {
      this.isAuth = auth.isAuthenticated;
      this.user = auth.user;
    });
  }

  ngOnInit(): void {
    this.authService.user.subscribe((data: UserResponse) => this.user = data);
  }

  goToUserProfile() {
    this.router.navigateByUrl('/profile/' + this.user._id );
  }

  logout() {
    this.authService.logoutMe();
    this.store.dispatch(logout());
    this.router.navigateByUrl('');
  }

}
