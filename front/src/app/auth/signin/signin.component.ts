import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit
{
    signinForm!: FormGroup;
    isSignInFailed= false;
    isSuccessful = false;
    errorMessage!: string;

    constructor(
        private storageService: StorageService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router)
    { }

    ngOnInit(): void {
        this.signinForm = this.formBuilder.group({
                email: [null, [Validators.required, Validators.email]],
                password: [null, Validators.required, Validators.minLength(6)]
        });

        // If the user is already connected redirect him to the home page.
        let isSignedIn = this.storageService.isSignedIn();
        if (isSignedIn) {
            this.router.navigate(['/']);
        }
    }

    onSignin(): void {
        const email = this.signinForm.get('email')!.value;
        const password = this.signinForm.get('password')!.value;

        this.authService.signin(email, password).subscribe({
            next: data => {
                console.log(data);
                this.isSuccessful = true;
                this.isSignInFailed = false;

                this.storageService.saveUser(data);

                setTimeout(() => {
                    window.location.reload();
                    this.router.navigate(['/']);
                }, 3000);
            },
            error: err => {
                this.errorMessage = err.error.message;
                this.isSignInFailed = true;

                setTimeout(() => {
                    this.isSignInFailed = false;
                }, 3000);
            }
        });
    }

}
