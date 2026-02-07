import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {CommonModule} from '@angular/common';

//import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu-asistencias',
    imports: [
        AccordionModule,
        CommonModule,

    ],
    templateUrl: './menu-asistencias.component.html',
    styleUrl: './menu-asistencias.component.scss'
})
export class MenuAsistenciasComponent implements OnInit {

    @Input() tituloMenu: string = 'Menú';
    opcionSeleccionada: WritableSignal<number> = signal(0);


    opMenuAsignaciones: { value: number, desc: string }[] = [
        {
            value: 1,
            desc: "Asistencia extraordinaria",
        },
        {
            value: 2,
            desc: "Tablero de asistencia",
        },
        {
            value: 3,
            desc: "Asistencia",
        }


    ];

    ngOnInit() {
    }

    seleccionarOpcion(id: number) {
        this.opcionSeleccionada.set(id);
    }

}
