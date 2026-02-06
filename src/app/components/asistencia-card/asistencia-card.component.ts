import { Component, Input } from '@angular/core';

@Component({
    selector: 'asistencia-card',
    standalone: true,

    templateUrl: './asistencia-card.component.html',
    styleUrl: './asistencia-card.component.scss'
})
export class AsistenciaCardComponent {
    @Input() encabezado: string = '';
    @Input() descripcion: string = '';
    @Input() icono: string = '';
    @Input() bg_color: string = '';

    // Elimina la propiedad "classList" fija y usa un getter
    get iconClass() {
        return ['pi', this.icono, 'text-2xl'];
    }
}
