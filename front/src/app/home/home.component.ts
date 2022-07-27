import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faCalendarDays, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { Post } from '../models/Post.model';
import { PostsService } from '../services/posts.service';
import { User } from '../models/User.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
    faCalendarDays = faCalendarDays;
    faThumbsUp = faThumbsUp;
    faThumbsDown = faThumbsDown;

    posts: Post[] = [];

    user!: User;

    constructor(
        private postsService: PostsService,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void
    {
        this.postsService.posts$.subscribe(posts => {
            this.posts = posts;
        });
        this.postsService.getPosts();


        this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

    onLike(id: string)
    {
        const postIndex = this.posts.findIndex(post => post.id === id);

        let totalLikes = 0;
        let usersLiked = [];
        /**
         *      1 : like
         *     -1 : dislike
         *      0 : cancel like/dislike
         */
        let type = 0;

        if (this.posts[postIndex].usersLiked.includes(this.user.id)) {
            // The user cancel his like.
            const userIndex = this.posts[postIndex].usersLiked.indexOf(this.user.id!);
            this.posts[postIndex].usersLiked.splice(userIndex, 1);

            totalLikes = this.posts[postIndex].likes - 1;
            usersLiked = this.posts[postIndex].usersLiked;

        } else {
            // The user liked the post.
            this.posts[postIndex].usersLiked.push(this.user.id!);

            totalLikes = this.posts[postIndex].likes + 1;
            usersLiked = this.posts[postIndex].usersLiked;

            type = 1;
        }

        // Assign news values to the post.
        this.posts[postIndex] =  {
            ... this.posts[postIndex],
            likes: totalLikes,
            usersLiked: usersLiked
        }

        // Request to the server with the type and the post id.
        this.postsService.ratePost(id, type).subscribe({
            next: data => {
                this.toastr.success(data.message, 'Success!');
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }

    onDislike(id: string)
    {
        const postIndex = this.posts.findIndex(post => post.id === id);

        let totalDislikes = 0;
        let usersDisliked = [];
        /**
         *      1 : like
         *     -1 : dislike
         *      0 : cancel like/dislike
         */
        let type = 0;

        if (this.posts[postIndex].usersDisliked.includes(this.user.id)) {
            // The user cancel his like.
            const userIndex = this.posts[postIndex].usersDisliked.indexOf(this.user.id!);
            this.posts[postIndex].usersDisliked.splice(userIndex, 1);

            totalDislikes = this.posts[postIndex].dislikes - 1;
            usersDisliked = this.posts[postIndex].usersDisliked;

        } else {
            // The user liked the post.
            this.posts[postIndex].usersDisliked.push(this.user.id!);

            totalDislikes = this.posts[postIndex].dislikes + 1;
            usersDisliked = this.posts[postIndex].usersDisliked;

            type = -1;
        }

        // Assign news values to the post.
        this.posts[postIndex] =  {
            ... this.posts[postIndex],
            dislikes: totalDislikes,
            usersDisliked: usersDisliked
        }

        // Request to the server with the type and the post id.
        this.postsService.ratePost(id, type).subscribe({
            next: data => {
                this.toastr.success(data.message, 'Success!');
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }

    editPost(id: string)
    {
        this.router.navigateByUrl('posts/edit/' + id);
    }

    deletePost(id: string)
    {
        this.postsService.deletePost(id).subscribe({
            next: data => {
                this.toastr.success(data.message, 'Success!');

                // Refresh the posts without refreshing the windows.
                this.postsService.getPosts();
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }
}
