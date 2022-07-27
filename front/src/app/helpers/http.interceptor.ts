import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor
{

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const authToken = this.authService.getToken();

        const newRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

        return next.handle(newRequest);
    }
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor
{

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        let handled: boolean = false;

        return next.handle(req)
            .pipe(
                retry(1),
                catchError((returnedError) => {
                    let errorMessage = null;

                    if (returnedError.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${returnedError.error.message}`;
                    } else if (returnedError instanceof HttpErrorResponse) {
                        errorMessage = `Error Status ${returnedError.status}: ${returnedError.error.error} - ${returnedError.error.message}`;
                        handled = this.handleServerSideError(returnedError);
                    }

                    // Display the error message.
                    this.toastr.error(returnedError.error.message, 'Error!');

                    if (!handled) {
                        if (errorMessage) {
                            return throwError(errorMessage);
                        } else {
                            return throwError("Unexpected problem occurred");
                        }
                    } else {
                        return of(returnedError);
                    }
                })
            )

    }

    private handleServerSideError(error: HttpErrorResponse): boolean {
        let handled: boolean = false;

        switch (error.status) {
          case 401:
            this.authService.logout();
            handled = true;
            break;
          case 403:
            this.router.navigateByUrl('/');
            handled = true;
            break;
        }

        return handled;
      }
}