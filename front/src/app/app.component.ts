import { Component } from '@angular/core';

import { User } from './models/User.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent
{
    loggedIn: boolean = false;

    user: User|null = null;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.loggedIn.subscribe(loggedIn => {
            this.loggedIn = loggedIn;
        });

        this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
