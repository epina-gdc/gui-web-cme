import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-buscar-convocatoria',
  imports: [CommonModule, CardModule],
  templateUrl: './buscar-convocatoria.component.html',
  styleUrl: './buscar-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarConvocatoriaComponent { }
