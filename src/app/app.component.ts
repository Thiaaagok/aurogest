import { Component, inject, NgZone, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNgModule } from './features/common/material/primeng.module';
import { CustomMaterialModule } from './features/common/material/custom-material.module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from './theme.service';
import { TopbarComponent } from './features/common/components/navbar/topbar.component';
import { SidebarComponent } from './features/common/components/navbar/sidebar.component';
import { AuthService } from './features/auth/services/auth.service';
import { UtilitiesService } from './features/common/services/utilities.services';

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    PrimeNgModule,
    CustomMaterialModule,
    CommonModule,
    RouterModule,
    TopbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'aurogest';
  private router = inject(Router);
  private auth = inject(AuthService);
  private utilitiesService = inject(UtilitiesService);
  private ngZone = inject(NgZone);

  collapsed = signal<boolean>(false);
  login = this.router.url === '/login';
  theme = inject(ThemeService);

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.cargarUsuarioActual().subscribe();
    }
    this.utilitiesService.login$.subscribe((login: boolean) => {
      this.ngZone.run(() => {
        this.login = login;
      });
    });
  }
}
