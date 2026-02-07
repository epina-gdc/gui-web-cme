import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-proceso-asignacion',
  imports: [CardModule],
  templateUrl: './proceso-asignacion.component.html',
  styleUrl: './proceso-asignacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcesoAsignacionComponent {

}
