import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
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
        private authService: AuthService)
    { }

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]]
        });
    }

    onSignup(): void {
        const email = this.signupForm.get('email')!.value;
        const password = this.signupForm.get('password')!.value;

        this.authService.signup(email, password);
    }
}
