import { Component } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { User } from './models/User.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent
{
    loggedIn$!: Observable<boolean>;

    user!: User;

    constructor(private authService: AuthService) {}

    ngOnInit(): void
    {
        this.loggedIn$ = this.authService.loggedIn$.pipe(
            shareReplay(1)
        );

        this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
