import { Component } from '@angular/core';
import { ButtonModule} from 'primeng/button'
import { NavbarComponent } from './features/common/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'argysoft';
}
