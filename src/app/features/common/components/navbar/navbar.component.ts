import { ChangeDetectorRef, Component, ElementRef, inject, NgZone, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { PrimeNgModule } from '../../material/primeng.module';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Modulo, Modulos } from './menu';
import { MenuItem } from 'primeng/api';
import { UtilitiesService } from '../../services/utilities.services';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [PrimeNgModule, CustomMaterialModule, CommonModule, RouterModule]
})
export class NavbarComponent {
  @ViewChild('snav') snav!: MatSidenav;

  modulos: MenuItem[] = [];
  subscription: Subscription;
  login: boolean;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  ventaNueva: boolean;

  private utilitiesService = inject(UtilitiesService);
  private ngZone = inject(NgZone);

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
    this.modulos = Modulos
    this.utilitiesService.login$.subscribe((login: boolean) => {
      this.ngZone.run(() => {
        this.login = login;
      });
    });
  }

cerrarSnav() {
  this.snav.close();
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}


}