import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostModel} from '../../models/post.model';
import {VoteModel} from '../../models/vote-model.payload';
import {VoteService} from '../../services/vote.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PostService} from '../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {MyState} from '../../models/MyState';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit, OnDestroy {
  postSubscription: Subscription;
  voteSubscription: Subscription;

  auth$: Observable<MyState>;
  isAuth = false;

  @Input() post: PostModel;
  votePayload: VoteModel;
  upvoteColor: string;
  downvoteColor: string;


  constructor(private voteService: VoteService, private router: Router,
              private authService: AuthService, private store: Store<{ auth: MyState }>,
              private postService: PostService, private toaster: ToastrService) {
    this.auth$ = store.pipe(select('auth'));

    this.auth$.subscribe((auth: MyState) => {
      this.isAuth = auth.isAuthenticated;
    });

    this.votePayload = {
      voteType: undefined,
      postId: undefined
    };
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // this.postSubscription.unsubscribe();
    // this.voteSubscription.unsubscribe();
  }

  upVotePost(): void {
    this.votePayload.voteType = 1;
    this.downvoteColor = '';
    this.vote();
  }

  downVotePost(): void {
    this.votePayload.voteType = -1;
    this.upvoteColor = '';
    this.vote();
  }

  private vote(): any {

    if (this.isAuth) {
      this.votePayload.postId = this.post._id;
      this.voteSubscription = this.voteService.vote(this.votePayload).subscribe(() => {
        this.updateVoteDetails(this.votePayload.postId);
      }, error => {
        if (error.status === 401) {
          this.toaster.info('Login/Register for vote');
          // this.router.navigateByUrl('/login');
          return;
        }
        this.toaster.error(error.error.message);
      });
    } else {
      this.toaster.warning('Please login for vote');
    }
  }

  private updateVoteDetails(postId: string): void {
    // console.log(this)
    this.postSubscription = this.postService.getPost(postId).subscribe(post => {
      this.post = post;
    });
  }
}
