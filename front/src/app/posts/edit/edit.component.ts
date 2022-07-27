import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit
{
    postForm!: FormGroup;
    imagePreview!: string;
    id!: number;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private postsService: PostsService,
        private toastr: ToastrService) { }

    ngOnInit(): void
    {
        this.postForm = this.formBuilder.group({
            content: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(250)]],
            image: [null],
        });

        this.route.params.subscribe(params => {
            this.id = +params['id'];

            this.postsService.getPost(params['id']).subscribe({
                next: data => {
                    this.postForm.patchValue(data);
                    this.imagePreview = data.imageUrl;
                },
                error: err => {
                    this.toastr.error(err.error.message, 'Error!');
                }
            });

        });
    }

    onSubmit()
    {
        const data = {
            content: this.postForm.get('content')!.value
        }

        this.postsService.updatePost(this.id, data, this.postForm.get('image')!.value).subscribe({
            next: data => {
                this.toastr.success(data.message, 'Success!');

                // Redirect to homepage.
                this.router.navigateByUrl('/');
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
