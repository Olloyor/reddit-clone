import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PostService} from '../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddPostPayload} from '../../models/add-post.payload';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})
export class PostAddComponent implements OnInit {

  createPostForm: FormGroup;
  postPayload: AddPostPayload;

  constructor(private router: Router, private postService: PostService, private toaster: ToastrService) {
    this.postPayload = {
      name: '',
      description: '',
    };
  }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.minLength(5), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required,
        Validators.minLength(15), Validators.maxLength(1500)]),
    });
  }

  isBtnDisabled(): boolean {
    return this.createPostForm.invalid;
  }

  createPost() {
    this.postPayload.name = this.createPostForm.get('name').value;
    this.postPayload.description = this.createPostForm.get('description').value;

    this.postService.createPost(this.postPayload).subscribe((data) => {
      this.toaster.success('Post Added');
      this.router.navigateByUrl('/post/' + data._id);
    }, error => {
      console.log(error);
      if (error.status === 400) {
        this.toaster.warning(error.error.error);
        return;
      }
      this.toaster.error('Error occurred');
      throwError(error);
    });
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }
}
