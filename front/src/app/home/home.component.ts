import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Post } from '../models/Post.model';
import { PostsService } from '../services/posts.service';

import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
    faCalendarDays = faCalendarDays;

    posts$!: Observable<Post[]>;

    constructor(
        private postsService: PostsService,
        private router: Router) { }

    ngOnInit(): void {
        /*this.postsService.getPosts();
        this.posts$ = this.postsService.posts$.pipe();*/
        this.posts$ = this.postsService.getPosts();
    }

}
