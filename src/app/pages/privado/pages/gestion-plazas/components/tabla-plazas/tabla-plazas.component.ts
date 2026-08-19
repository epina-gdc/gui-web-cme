import { ChangeDetectionStrategy, Component, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Popover, PopoverModule } from 'primeng/popover';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PillComponent } from '@components/pill/pill.component';
import { GestionPlazaInterface, TipoBusquedaPlaza } from '@models/gestion-plaza.interface';
import { AccionPlaza } from '@models/gestion-plaza.interface';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tabla-plazas',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        PopoverModule,
        PaginatorModule,
        PillComponent,
        RouterLink
    ],
    templateUrl: './tabla-plazas.component.html',
    styleUrl: './tabla-plazas.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaPlazasComponent {
    readonly TipoBusquedaPlaza = TipoBusquedaPlaza;
    readonly op = viewChild<Popover>('op');

    readonly plazas = input<GestionPlazaInterface[]>([]);
    readonly totalRecords = input<number>(0);
    readonly first = input<number>(0);
    readonly rows = input<number>(10);
    readonly titulo = input<string>('Plazas nuevas');
    readonly mostrarPaginador = input<boolean>(true);
    readonly tipoBusqueda = input<TipoBusquedaPlaza>(TipoBusquedaPlaza.BusquedaManual);

    readonly pageChange = output<PaginatorState>();
    readonly accionSeleccionada = output<{plaza:GestionPlazaInterface, accion: AccionPlaza}>();


    readonly plazaSeleccionada = signal<GestionPlazaInterface | null>(null);

    readonly AccionPlaza = AccionPlaza;

    abrirAcciones(event: Event, plaza: GestionPlazaInterface): void {
        this.plazaSeleccionada.set(plaza);
        this.op()?.toggle(event);
    }

    detallePlazaSeleccionada(accion: AccionPlaza): void {
      const plaza = this.plazaSeleccionada();
        if (!plaza) return;

        const movimiento = {
            plaza,
            accion
        };

        this.accionSeleccionada.emit(movimiento);
        this.op()?.hide();
    }

    onPageChange(event: PaginatorState): void {
        this.pageChange.emit(event);
    }


    getPillType(estatus: string): number {
        switch (estatus?.toLowerCase()) {
            case 'vacante':
                return 3;
            case 'etiquetada':
                return 1;
            case 'ocupado':
            case 'ocupada':
                return 0;
            default:
                return 2;
        }
    }
}
