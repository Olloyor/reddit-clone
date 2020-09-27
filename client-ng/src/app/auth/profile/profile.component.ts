import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {CommentService} from '../../services/comment.service';
import {PostService} from '../../services/post.service';

import {PostModel} from '../../models/post.model';
import {CommentModel} from '../../models/comment-model.payload';
import {AuthService} from '../../services/auth.service';
import {UserResponse} from '../../models/user-profile.payload';
import {select, Store} from '@ngrx/store';
import {MyState} from '../../models/MyState';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  postsSubscription: Subscription;
  commentsSubscription: Subscription;
  auth$: Observable<MyState>;
  id: string;
  user: UserResponse;
  posts: PostModel[];
  comments: CommentModel[];
  postLength = 0;
  commentLength = 0;

  constructor(private store: Store<{ auth: MyState }>, private activatedRoute: ActivatedRoute,
              private postService: PostService, private commentService: CommentService) {
    this.auth$ = store.pipe(select('auth'));
    this.auth$.subscribe((auth) => {
      this.user = auth.user;
    });
    this.id = this.activatedRoute.snapshot.params.id;
    this.getAllPosts();
    this.getAllComments();
  }

  getAllPosts() {
    this.postsSubscription = this.postService.getAllPostsByUser(this.id).subscribe(data => {
      this.posts = data;
      this.postLength = data.length;
    });
  }
  getAllComments() {
    this.commentsSubscription = this.commentService.getAllCommentsByUser(this.id).subscribe(data => {
      this.comments = data;
      this.commentLength = data.length;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.getAllPosts();
          this.getAllComments();
        }
      );
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.commentsSubscription.unsubscribe();
  }

}
