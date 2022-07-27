import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../models/User.model';

const AUTH_API = 'http://localhost:3000/api/auth/';

@Injectable({
  providedIn: 'root',
})

export class AuthService
{
    /**
     * The Subject that is used to set if the user is loggedIn.
     *
     * @property {BehaviorSubject}
     */
    loggedIn$ = new BehaviorSubject<boolean>(false);

    /**
     * The user Subject that is used to display his information in the header.
     */
    user = new BehaviorSubject<User>({id: '0',
        email: '',
        is_admin: false,
        createdAt: '',
        updatedAt: ''
    });

    /**
     * The key used to store the token in the locastorage.
     *
     * @property {string}
     */
    private tokenName = 'groupomania-token';

    /**
     * The key used to store the user in the locastorage.
     *
     * @property {string}
     */
    private userName = 'groupomania-user';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router)
    {
        // If there's a token in the localstorage, the user is already connected.
        if (localStorage.getItem(this.tokenName)) {
            this.loggedIn$.next(true);

            this.user.next(this.getUser());
        }
    }

    /**
     * Function to get the token from the localstorage.
     *
     * @returns {string|null} The token from the localstorage.
     */
    getToken()
    {
        return  localStorage.getItem(this.tokenName);
    }

    /**
     * Function to get the user from localstorage.
     *
     * @returns {string} The user from the localstorage.
     */
    getUser()
    {
        const user = localStorage.getItem(this.userName);

        if (user == null) {
            this.logout();
            return;
        }

        return JSON.parse(user);
    }

    /**
     * Function to signin an user.
     *
     * @param {string} email The email of the user.
     * @param {string} password The password of the user.
     *
     * @return {void}
     */
    signin(email: string, password: string): void
    {
        this.http.post(AUTH_API + 'signin', { email, password }).subscribe({
            next: (data: any) => {
                this.loggedIn$.next(true);
                this.user.next(data.user);
                localStorage.setItem(this.tokenName, data.token);
                localStorage.setItem(this.userName, JSON.stringify(data.user));

                this.toastr.success('You are signed in!', 'Success!');
                this.router.navigate(['/']);
            },
            error: err => {
                this.loggedIn$.next(false);
                this.toastr.error(err.error.message, 'Error!');
            }
      });
    }

    /**
     * Function to signup an user.
     *
     * @param {string} email The email of the new user.
     * @param {string} password The password of the new user.
     *
     * @return {void}
     */
    signup(email: string, password: string): void
    {
        this.http.post(AUTH_API + 'signup', { email, password }).subscribe({
            next: data => {
                this.toastr.success('Your registration is successful!', 'Success!');

                this.router.navigate(['/auth/signin']);
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }

    /**
     * Function to logout the user.
     *
     * @return {void}
     */
    logout(): void
    {
        localStorage.removeItem(this.tokenName);
        localStorage.removeItem(this.userName);
        this.loggedIn$.next(false);
        this.user.next({});
        this.router.navigate(['auth/signin']);
    }
}
