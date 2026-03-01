import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { PrimeNgModule } from '../../material/primeng.module';
import { FluidModule } from 'primeng/fluid';
import { UtilitiesService } from '../../services/utilities.services';
import { Login } from '../../models/login.model';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../auth/services/auth.service';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-login',
  imports: [
    PrimeNgModule,
    CustomMaterialModule,
    CommonModule,
    RouterModule,
    FluidModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginUsuario: Login = new Login();

  private utilitiesService = inject(UtilitiesService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private alertasService = inject(AlertasService);

  constructor() {
    this.utilitiesService.setearLogin(true);
  }

  login() {
    this.auth
      .login(this.loginUsuario.Usuario, this.loginUsuario.Contrasenia)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          this.alertasService.errorAlerta(
            'Credenciales inválidas',
            'El usuario o la contraseña son incorrectos. Verificá los datos e intentá nuevamente.',
          );
        },
      });
  }
}
