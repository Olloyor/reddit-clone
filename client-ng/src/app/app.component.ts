import {Component, OnInit} from '@angular/core';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {login, logout} from './store/auth.actions';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Reddit Cli';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    if (this.authService.getJwtToken()){
      await this.authService.getUser();
    }else {
      this.authService.logoutMe();
    }
  }


}
