import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VoteModel} from '../models/vote-model.payload';
import {Observable} from 'rxjs';
import {General} from '../utils/General';


@Injectable({
  providedIn: 'root'
})
export class VoteService {

  baseUrl = General.URL;

  constructor(private http: HttpClient) {
  }

  vote(votePayload: VoteModel): Observable<any> {
    return this.http.post(this.baseUrl + '/api/vote/', votePayload);
  }
}
