import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { PermisoKey } from '../../common/enums/roles.enum';
import { RolUsuarioModel } from '../../roles-usuario/models/rol-usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.auth.isLoggedIn()) {
      return this.verificarPermiso(route);
    }

    const refreshToken = this.auth.getRefreshToken();
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.auth.refreshToken().pipe(
      map(() => this.verificarPermiso(route)),
      catchError(() => {
        this.auth.logout();
        this.router.navigate(['/login']);
        return of(false);
      }),
    );
  }

  private verificarPermiso(route: ActivatedRouteSnapshot): boolean {
    const requiredPermiso: PermisoKey = route.data?.['permiso'];
    if (!requiredPermiso) return true;

    const rol = this.auth.currentUser?.Rol;
    if (!rol) {
      this.router.navigate(['/home']);
      return false;
    }

    const tienePermiso = rol.Permisos?.includes(requiredPermiso) ?? false;
    if (!tienePermiso) this.router.navigate(['/home']);
    return tienePermiso;
  }
}
