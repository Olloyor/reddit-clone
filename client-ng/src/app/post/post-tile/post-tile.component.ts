import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {PostModel} from '../../models/post.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PostTileComponent implements OnInit {

  faComments = '';
  @Input() posts: PostModel[];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToPost(id: string): void {
    this.router.navigateByUrl('/post/' + id);
  }

}
