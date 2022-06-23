import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit
{
    signupForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService)
    { }

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]]
        });

        // If the user is already connected redirect him to the home page.
        if(this.authService.loggedIn) {
            this.router.navigate(['/']);
        }
    }

    onSignup(): void {
        const email = this.signupForm.get('email')!.value;
        const password = this.signupForm.get('password')!.value;

        this.authService.signup(email, password).subscribe({
            next: data => {
                this.toastr.success('Your registration is successful!', 'Success!');

                setTimeout(() => {
                    this.router.navigate(['/auth/signin']);
                }, 3000);
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }
}
