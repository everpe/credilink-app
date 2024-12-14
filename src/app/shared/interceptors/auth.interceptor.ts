import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRedirecting = false;

  constructor(private authService: AuthService,
    private router: Router,
    private snackBar: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRedirecting) {
          this.isRedirecting = true; // Marca como redirigiendo
          this.authService.clearToken();
          this.router.navigate(['/authentication/login']).then(() => {
            this.snackBar.info('Sesión expirada, inicie nuevamente.');
            this.isRedirecting = false; // Reinicia la bandera tras redirigir
          });
        }

        return throwError(() => error); // Reemplace el uso directo de `throwError`
      })
    );
  }
}