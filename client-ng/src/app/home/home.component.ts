import { Component, OnInit } from '@angular/core';
import {PostModel} from '../models/post.model';
import {PostService} from '../services/post.service';
import {login, logout} from '../store/auth.actions';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AuthService} from '../services/auth.service';
import {MyState} from '../models/MyState';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auth$: Observable<MyState>;
  isAuth = false;

  posts: Array<PostModel> = [];

  constructor(private store: Store<{ auth: MyState }>, private postService: PostService, private authService: AuthService) {
    this.auth$ = store.pipe(select('auth'));

    this.auth$.subscribe((auth: MyState) => {
      this.isAuth = auth.isAuthenticated;
    });
    this.postService.getAllPosts().subscribe(post => {
      this.posts = post;
    }, error => {
      if (error.status === 0){
        console.log('No Internet');
        return;
      }
    });
    if (this.isAuth){
      this.authService.getUser();
    }
  }

  ngOnInit(): void {
  }

}
