import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import { AlertComponent } from './core/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,
  AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = 'Convocatoria para Médicos Especialistas';
}
