import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {RegisterRequestPayload} from '../auth/register/register-request.payload';
import {LoginRequestPayload} from '../auth/login/login-request.payload';
import {AuthResponse} from '../models/auth-response.payload';

import {General} from '../utils/General';
import {UserResponse} from '../models/user-profile.payload';
import {select, Store} from '@ngrx/store';
import {setUser, login, logout} from '../store/auth.actions';
import {MyState} from '../models/MyState';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth$: Observable<MyState>;

  @Output() isAuthenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() user: EventEmitter<UserResponse> = new EventEmitter();

  readonly baseUrl = General.URL;
  readonly tokenName = 'authToken';

  constructor(private store: Store<MyState>, private httpClient: HttpClient) {

  }

  register(registerRequestPayload: RegisterRequestPayload): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.baseUrl + '/api/auth/register', registerRequestPayload)
      .pipe(map(data => {
        console.log(data);
        localStorage.setItem(this.tokenName, data.accessToken);
        this.store.dispatch(login());
        this.isAuthenticated.emit(true);

        return data;
      }));
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.baseUrl + '/api/auth/login', loginRequestPayload)
      .pipe(map(data => {

        localStorage.setItem(this.tokenName, data.accessToken);
        this.store.dispatch(login());
        this.isAuthenticated.emit(true);
        return data;
      }));
  }


  getUser() {
    this.httpClient.get<UserResponse>(this.baseUrl + '/api/user/me')
      .subscribe(data => {
        this.store.dispatch(login());
        this.store.dispatch(setUser({user: data}));
        this.user.emit(data);
      }, error => {
        console.log(error);
        if (error.status === 400 || error.status === 401) {
          console.log(this.getJwtToken());
          this.logoutMe();
        }
        if (error.status === 0) {
          return false;
        }
        localStorage.removeItem(this.tokenName);
      });
  }

  getJwtToken(): any {
    return localStorage.getItem(this.tokenName);
  }

  logoutMe() {
    localStorage.setItem(this.tokenName, null);
    localStorage.removeItem(this.tokenName);
    this.store.dispatch(logout());
    // this.httpClient.post(this.baseUrl + '/api/auth/logout',
    //   {responseType: 'text'})
    //   .subscribe(data => {
    //     console.log(data);
    //   }, error => {
    //     throwError(error);
    //   });
  }

}
