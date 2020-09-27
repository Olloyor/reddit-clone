import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostModel} from '../models/post.model';
import {Observable} from 'rxjs';
import {AddPostPayload} from '../models/add-post.payload';
import {General} from '../utils/General';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = General.URL;

  constructor(private http: HttpClient) {
  }

  getAllPosts(): Observable<Array<PostModel>> {
    return this.http.get<Array<PostModel>>(this.baseUrl + '/api/post/all');
  }

  createPost(postPayload: AddPostPayload): Observable<any> {
    return this.http.post(this.baseUrl + '/api/post/add', postPayload);
  }

  getPost(id: string): Observable<PostModel> {
    return this.http.get<PostModel>(this.baseUrl + '/api/post/' + id);
  }

  getAllPostsByUser(_id: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(this.baseUrl + '/api/post/by_user/' + _id);
  }
}
