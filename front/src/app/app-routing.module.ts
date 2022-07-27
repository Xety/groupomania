import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard.service';


const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] },
    //Lazy Loading : Evite de charger les modules si les routes ne correspondent pas.
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },

    { path: '**', redirectTo: '' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
