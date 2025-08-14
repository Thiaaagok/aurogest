import { Component, inject } from '@angular/core';
import { ButtonModule} from 'primeng/button'
import { NavbarComponent } from './features/common/components/navbar/navbar.component';
import { PRIME_NG_CONFIG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'aurogest';
}
