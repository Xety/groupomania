import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, catchError, map, Observable, Subject } from 'rxjs';

import { Post } from '../models/Post.model';

const AUTH_API = 'http://localhost:3000/api/posts';

const httpOptions = {
    withCredentials: true,
};

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    /**
     * The posts Subject that his used to display on homepage.
     *
     * @property {BehaviorSubject}
     */
    posts$ = new BehaviorSubject<Post[]>([]);

    /**
     * Constructor.
     *
     * @param {HttpClient} http Inject the HttpClient dependance.
     * @param {ToastrService} toastr Inject the ToastrService dependance.
     */
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,

    ) { }

    /**
     * Get all posts and push the datas in the Subject.
     *
     * @return {void}
     */
    getPosts(): void
    {
        this.http.get<Post[]>(AUTH_API, httpOptions).subscribe({
            next: data => {
                this.posts$.next(data);
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }

    /**
     * Get a single post.
     * @param {string} id The id of the post.
     *
     * @returns {Observable}
     */
    getPost(id: string): Observable<Post>
    {
        return this.http.get<Post>(AUTH_API + '/' + id);
    }

    /**
     * Create a post and refresh the posts on homepage.
     *
     * @param {object} post The post object with the data to create.
     * @param {File} image The image to send to the server.
     *
     * @return {Observable}
     */
    createPost(post: object, image: File): Observable<{ message: string }>
    {
        const formData = new FormData();
        formData.append('post', JSON.stringify(post));
        formData.append('image', image);

        return this.http.post<{ message: string }>(AUTH_API, formData);
    }

    /**
     * Update a post.
     *
     * @param {number} post The post id to update.
     * @param {object} data The data object with the data to update.
     * @param {File} image The image to send to the server.
     *
     * @return {Observable}
     */
     updatePost(post: number, data: object, image: File): Observable<{ message: string }>
    {
        const formData = new FormData();
        formData.append('post', JSON.stringify(data));
        formData.append('image', image);

        return this.http.put<{ message: string }>(AUTH_API + '/' + post, formData);
    }

    /**
     * Delete a post.
     *
     * @param {string} id The id of the post.
     *
     * @returns {Observable}
     */
    deletePost(id: string): Observable<{ message: string }>
    {
        return this.http.delete<{ message: string }>(AUTH_API + '/' + id);
    }

    /**
     * Rate a post.
     *
     * @param {string} id The id of the post.
     * @param {number} type The type of the rate.
     *
     * @returns  {Observable}
     */
    ratePost(id: string, type: number): Observable<{ message: string }>
    {
        return this.http.post<{ message: string }>(AUTH_API + '/' + id + '/rate', { type: type, id: id });
    }
}
