import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit
{
    signupForm!: FormGroup;
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage!: string;

    constructor(
        private storageService: StorageService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router)
    { }

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required, Validators.minLength(6)]
        });

        // If the user is already connected redirect him to the home page.
        let isSignedIn = this.storageService.isSignedIn();
        if (isSignedIn) {
            this.router.navigate(['/']);
        }
    }

    onSignup(): void {
        const email = this.signupForm.get('email')!.value;
        const password = this.signupForm.get('password')!.value;

        this.authService.signup(email, password).subscribe({
            next: data => {
                console.log(data);
                this.isSuccessful = true;
                this.isSignUpFailed = false;

                setTimeout(() => {
                    this.router.navigate(['/signin']);
                }, 3000);
            },
            error: err => {
                this.errorMessage = err.error.message;
                this.isSignUpFailed = true;

                setTimeout(() => {
                    this.isSignUpFailed = false;
                }, 3000);
            }
        });
    }
}
