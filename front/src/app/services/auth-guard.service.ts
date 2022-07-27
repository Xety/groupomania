import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Observable<boolean>
    {
        return this.authService.loggedIn$.pipe(
            take(1),
            tap(auth => {
                console.log(`CanActivate : ${auth}`);

                if (!auth) {
                    this.router.navigate(['/auth/signin']);
                }
            })
        );
    }
}
