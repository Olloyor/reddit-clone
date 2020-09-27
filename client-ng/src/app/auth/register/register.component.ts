import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {RegisterRequestPayload} from './register-request.payload';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerRequestPayload: RegisterRequestPayload;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,
              private toaster: ToastrService) {
    this.registerRequestPayload = {
      name: '',
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2),
                      Validators.maxLength(50)] ),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  register(): void {
    this.registerRequestPayload.email = this.registerForm.get('email').value;
    this.registerRequestPayload.name = this.registerForm.get('name').value;
    this.registerRequestPayload.password = this.registerForm.get('password').value;

    this.authService.register(this.registerRequestPayload).subscribe(data => {
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error);
      if (error.status === 400) {
        this.toaster.warning(error.error.error);
      } else {
        this.toaster.error('Registration Failed! Please try again');
      }
    });
  }

}
