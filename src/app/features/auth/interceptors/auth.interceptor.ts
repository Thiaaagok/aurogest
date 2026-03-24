import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
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
  throwError,
} from 'rxjs';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

import { MatSnackBar } from '@angular/material/snack-bar'; // o lo que uses
import { AlertasService } from '../../common/services/alertas.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const token = auth.getAccessToken();

  const alerta = inject(AlertasService);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 🔐 manejo de auth (lo tuyo)
      if (error.status === 401 && !authReq.url.includes('/auth/refresh')) {
        return handle401(authReq, next, auth, router).pipe(
          catchError((err) => {
            alerta.errorAlerta('Sesión expirada', 'Volvé a iniciar sesión');
            return throwError(() => err);
          }),
        );
      }

      if (error.status === 401) {
        return throwError(() => error);
      }

      let mensaje = 'Ocurrió un error inesperado';

      if (error.error?.message) {
        mensaje = error.error.message;
      } else if (error.status === 0) {
        mensaje = 'No se pudo conectar con el servidor';
      }

      // 👉 mostrar alerta
      alerta.errorAlerta('Error', mensaje);

      return throwError(() => error);
    }),
  );
};
function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: AuthService,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return auth.refreshToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshSubject.next(res.accessToken);
        auth.setAccessToken(res.accessToken);

        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${res.accessToken}` },
          }),
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        auth.logout();
        router.navigate(['/login']);
        return throwError(() => err);
      }),
    );
  }

  return refreshSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) =>
      next(
        req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        }),
      ),
    ),
  );
}
