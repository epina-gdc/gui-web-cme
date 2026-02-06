import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-detalle-convocatoria',
  imports: [CommonModule,CardModule, Avatar, ProgressBarModule],
  templateUrl: './detalle-convocatoria.component.html',
  styleUrl: './detalle-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleConvocatoriaComponent implements OnInit, OnDestroy {
  value = signal(97);
  private intervalId: number | null = null;

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      if (this.value() < 95) {
        this.value.update(valor => 95);
      } else {

        this.value.update(valor => (valor + 1) % 101); // 0 a 100
      }



    }, 1000); // cada segundo
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
}
