import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit
{
    postForm!: FormGroup;
    imagePreview!: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit(): void
    {
        this.postForm = this.formBuilder.group({
            content: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(250)]],
            image: [null, Validators.required],
        });
    }

    onSubmit()
    {
    }

    onFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files![0];
        this.postForm.get('image')!.setValue(file);
        this.postForm.updateValueAndValidity();
        const reader = new FileReader();

        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

}
