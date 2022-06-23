import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { map, Observable, Subject } from 'rxjs';

import { Post } from '../models/Post.model';

const AUTH_API = 'http://localhost:3000/api/posts';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({
    providedIn: 'root'
})
export class PostsService
{

  //posts$ = new Subject<Post[]>();

    constructor(
        private http: HttpClient,
        private toastr: ToastrService
    ) { }

    getPosts() {
        /*this.http.get<Post[]>(AUTH_API, httpOptions).subscribe({
            next: posts => {
                this.posts$.next(posts);
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });*/
        return this.http.get<Post[]>(AUTH_API, httpOptions).pipe(
            map(result => result.map(post => new Post(post)))
        );
    }
}
