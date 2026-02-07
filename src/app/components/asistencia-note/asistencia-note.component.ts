import {Component, Input} from '@angular/core';

@Component({
    selector: 'asistencia-note',
    standalone: true,
    templateUrl: './asistencia-note.component.html',
    styleUrls: ['./asistencia-note.component.scss']
})
export class AsistenciaNoteComponent {
    @Input() titulo: string = '';
    @Input() descripcion: string = '';
    @Input() icono: string = '';
    @Input() ajuste: string = 'ml-4'
    @Input() tamanio: string = ''
    constructor() { }

    get iconClass() {
        return ['pi', this.icono, 'text-blue-400', this.tamanio];
    }
    get descClass() {
        return ['text-700', this.ajuste]
    }
}
