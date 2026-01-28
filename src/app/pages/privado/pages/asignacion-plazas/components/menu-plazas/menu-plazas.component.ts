import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-menu-plazas',
  imports: [
    AccordionModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './menu-plazas.component.html',
  styleUrl: './menu-plazas.component.scss'
})
export class MenuPlazasComponent implements OnInit{

  @Input()  tituloMenu: string = 'Menú';
  opcionSeleccionada: WritableSignal<number> = signal(0);


  opMenuAsignaciones: {value:number,desc:string}[] = [
    {
      value: 1,
      desc: "Asignación de plazas",
    },
    {
      value: 2,
      desc: "Cancelación de asignación",
    },
    {
      value: 3,
      desc: "Reporte de asignación",
    },
    {
      value: 4,
      desc: "Asignación de mesas y citas",
    }


  ];

  ngOnInit() {
  }



  seleccionarOpcion(id: number){
    this.opcionSeleccionada.set(id);
  }

}
