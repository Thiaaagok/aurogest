import { Component, inject } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent { 

  utilitiesService = inject(UtilitiesService);

  constructor(){
    this.utilitiesService.setTituloPagina('Home');
    this.utilitiesService.setearLogin(false);
  }
}
