import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { PrimeNgModule } from '../../material/primeng.module';
import { FluidModule } from 'primeng/fluid';
import { UtilitiesService } from '../../services/utilities.services';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  imports: [PrimeNgModule, CustomMaterialModule, CommonModule, RouterModule, FluidModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  loginUsuario: Login = new Login();

  private utilitiesService = inject(UtilitiesService);
  private router = inject(Router);

  constructor() {
    this.utilitiesService.setearLogin(true);
  }

  login() {

    const usuario = {
      Id: 'd89da3c3-2687-4647-9b3e-17d6414115fd',
      Usuario: 'Thiago',
    };

    localStorage.setItem('usuario', JSON.stringify({
      Id: usuario.Id,
      Usuario: usuario.Usuario,
    }));

    this.router.navigateByUrl('home')
  }

}
