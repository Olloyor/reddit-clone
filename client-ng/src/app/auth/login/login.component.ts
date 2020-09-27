import {Component, OnInit} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginRequestPayload} from './login-request.payload';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';
import {select, Store} from '@ngrx/store';
import {MyState} from '../../models/MyState';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth$: Observable<MyState>;
  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  loginError = '';


  constructor(private store: Store<{ auth: MyState }>, private authService: AuthService, private activatedRoute: ActivatedRoute,
              private router: Router, private toaster: ToastrService) {
    this.auth$ = store.pipe(select('auth'));
    this.auth$.subscribe((auth: MyState) => {
      if (auth.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
    this.loginRequestPayload = {
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl( this.loginRequestPayload.email,
        [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
    console.log(this.loginForm.invalid);
  }

  login(): void {
    this.loginError = '';
    this.loginRequestPayload.email = this.loginForm.get('email').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayload).subscribe(data => {

      this.router.navigate(['/']);
      this.toaster.success('Login Successful');
    }, error => {
      console.log(error);
      if (error.status === 400) {
        this.loginError = error.error.error;
        this.toaster.warning(error.error.error);
      } else {
        this.toaster.error('Login Failed! Please try again');
        throwError(error);
      }
    });
  }

}
