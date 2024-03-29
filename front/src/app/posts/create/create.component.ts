import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { PostsService } from 'src/app/services/posts.service';

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
        private postsService: PostsService,
        private toastr: ToastrService) { }

    ngOnInit(): void
    {
        this.postForm = this.formBuilder.group({
            content: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(250)]],
            image: [null, Validators.required],
        });
    }

    onSubmit()
    {
        const data = {
            content: this.postForm.get('content')!.value
        }

        this.postsService.createPost(data, this.postForm.get('image')!.value).subscribe({
            next: data => {
                this.toastr.success(data.message, 'Success!');

                // Reset the form.
                this.postForm.reset({content: '', image: ''});
                this.imagePreview = '';

                // Refresh the posts without refreshing the windows.
                this.postsService.getPosts();
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error!');
            }
        });
    }

    onFileChange(event: Event)
    {
        const file = (event.target as HTMLInputElement).files![0];
        this.postForm.patchValue({ image: file });
        this.postForm.get('image')!.updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

}
