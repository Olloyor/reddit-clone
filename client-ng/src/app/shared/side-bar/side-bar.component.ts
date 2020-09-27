import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PostService} from '../../services/post.service';
import {AuthService} from '../../services/auth.service';
import {select, Store} from '@ngrx/store';
import {MyState} from '../../models/MyState';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  auth$: Observable<MyState>;
  isAuth = false;

  constructor(private store: Store<{ auth: MyState }>, private router: Router, private toaster: ToastrService) {
    this.auth$ = store.pipe(select('auth'));

    this.auth$.subscribe((auth: MyState) => {
      this.isAuth = auth.isAuthenticated;
    });
  }

  ngOnInit() {}

  goToCreatePost() {
    // if (!this.isLoggedIn) {
    //   this.toaster.warning('Login/Register first');
    // }
    this.router.navigateByUrl('/post-add');
  }

}
