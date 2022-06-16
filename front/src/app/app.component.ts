import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
    is_admin = false;
    isSignedIn = false;
    email?: string;

    constructor(private storageService: StorageService, private authService: AuthService) { }

    ngOnInit(): void {
        this.isSignedIn = this.storageService.isSignedIn();

        if (this.isSignedIn) {
            const user = this.storageService.getUser();
            this.is_admin = user.is_admin;
            this.email = user.email;
        }
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: res => {
                console.log(res);
                this.storageService.clean();

                window.location.reload();
            },
            error: err => {
                console.log(err);
            }
        });
    }
}
