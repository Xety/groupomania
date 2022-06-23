import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleComponent } from './single/single.component';


@NgModule({
    declarations: [
    
    SingleComponent
  ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class PostsModule { }
