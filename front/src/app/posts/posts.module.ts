import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostsRoutingModule } from './posts-routing.module';
import { EditComponent } from './edit/edit.component';


@NgModule({
    declarations: [
        EditComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class PostsModule { }
