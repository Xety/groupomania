import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../models/User.model';

const AUTH_API = 'http://localhost:3000/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};
@Injectable({
  providedIn: 'root',
})

export class AuthService
{
    loggedIn: Subject<boolean>;
    user: Subject<User|null>;

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router)
    {
        this.loggedIn = new Subject();
        this.user = new Subject();
        this.getLogin();
    }

    signin(email: string, password: string)
    {
        this.http.post(AUTH_API + 'signin', { email, password }, httpOptions).subscribe({
            next: (data: any) => {
                console.log(data);
                this.loggedIn.next(true);
                this.toastr.success('You are signed in!', 'Success!');
                this.user.next(data);

                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            },
            error: err => {
                this.loggedIn.next(false);
                this.toastr.error(err.error.message, 'Error!');
            }
      });
    }

    signup(email: string, password: string): Observable<any> {
        return this.http.post(AUTH_API + 'signup', { email, password }, httpOptions);
    }

    /**
     * Function to logout the user from the front-end and back-end.
     *
     * @return {void}
     */
    logout(): void
    {
        this.http.post(AUTH_API + 'signout', { }, httpOptions).subscribe({
            next: data => {
                this.loggedIn.next(false);
                this.user.next(null);

                return this.router.navigate(['auth/signin']);
            },
            error: err => {
                this.toastr.error('Oops, something went wrong getting the user logged out', 'Error!');
            }
        });
    }

    /**
     * Function to get the loggedIn status from the server.
     *
     * @return {void}
     */
    getLogin(): void
    {
        this.http.get(AUTH_API + 'login', httpOptions).subscribe({
            next: (data: any) => {
                this.loggedIn.next(data.loggedIn);
                this.user.next(data.user);
            },
            error: err => {
                this.toastr.error('Oops, something went wrong getting the logged in status', 'Error!');
            }
      })
    }
}
