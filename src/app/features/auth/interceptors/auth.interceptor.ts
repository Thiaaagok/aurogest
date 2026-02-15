import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAccessToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authReq.url.includes('/auth/refresh')) {
        return handle401(authReq, next, auth, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: AuthService,
  router: Router
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return auth.refreshToken().pipe(
      switchMap(res => {
        isRefreshing = false;
        refreshSubject.next(res.accessToken);
        auth.setAccessToken(res.accessToken);

        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${res.accessToken}` }
        }));
      }),
      catchError(err => {
        isRefreshing = false;
        auth.logout();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  return refreshSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token =>
      next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      }))
    )
  );
}
