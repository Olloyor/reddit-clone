import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostModel} from '../../models/post.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommentModel} from '../../models/comment-model.payload';
import {PostService} from '../../services/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CommentService} from '../../services/comment.service';
import {Subscription, throwError} from 'rxjs';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit, OnDestroy {
  postSubscription: Subscription;
  commentSubscription: Subscription;

  postId: string;
  post: PostModel;
  commentForm: FormGroup;
  commentPayload: CommentModel;
  comments: CommentModel[];

  constructor(private postService: PostService, private activateRoute: ActivatedRoute,
              private commentService: CommentService, private toaster: ToastrService, private router: Router) {
    this.postId = this.activateRoute.snapshot.params.id;

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      post: this.postId
    };
    this.getPostById();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.commentSubscription.unsubscribe();
  }

  postComment(): any {
    this.commentPayload.text = this.commentForm.get('text').value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      console.log(data);
      this.commentForm.get('text').setValue('');
      this.getCommentsForPost();
    }, error => {
      if (error.status === 401) {
        this.toaster.info('Login/Register for comment');
        return;
      }
      this.toaster.error(error.error.error);
      // throwError(error);
    });
  }

  private getPostById() {
    this.postSubscription = this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
      this.getCommentsForPost();
    }, error => {
      console.log(error);
      if (error.status === 400){
        this.router.navigateByUrl('/404');
      }
      throwError(error);
    });
  }

  private getCommentsForPost(): void {
    this.commentSubscription = this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
    }, error => {
      if (error.status === 404){
        return false;
      }
      throwError(error);
    });
  }

}
