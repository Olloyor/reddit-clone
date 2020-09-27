import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommentModel} from '../models/comment-model.payload';
import {Observable} from 'rxjs';
import {General} from '../utils/General';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseUrl = General.URL;

  constructor(private httpClient: HttpClient) {
  }

  getAllCommentsForPost(postId: string): Observable<CommentModel[]> {
    return this.httpClient.get<CommentModel[]>(this.baseUrl + '/api/comment/by_post/' + postId);
  }

  getAllCommentsByUser(_id: string) {
    return this.httpClient.get<CommentModel[]>(this.baseUrl + '/api/comment/by_user/' + _id);
  }

  postComment(commentPayload: CommentModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/api/comment/create', commentPayload);
  }

}
