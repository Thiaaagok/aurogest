import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // Token válido → dejar pasar
    if (this.auth.isLoggedIn()) return true;

    // Token vencido pero hay refresh token → intentar renovar
    const refreshToken = this.auth.getRefreshToken();
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.auth.refreshToken().pipe(
      map(() => true),
      catchError(() => {
        this.auth.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}