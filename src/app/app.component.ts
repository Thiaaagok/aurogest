import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNgModule } from './features/common/material/primeng.module';
import { CustomMaterialModule } from './features/common/material/custom-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from './theme.service';
import { TopbarComponent } from './features/common/components/navbar/topbar.component';
import { SidebarComponent } from './features/common/components/navbar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, PrimeNgModule, CustomMaterialModule, CommonModule, RouterModule, TopbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'aurogest';
  collapsed = signal<boolean>(false);
  login = false; 
  theme = inject(ThemeService);
}
