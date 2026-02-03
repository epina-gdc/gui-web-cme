import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MenuAsistenciasComponent } from "../menu-asistencias/menu-asistencias.component";

// Interfaz para los datos del médico
interface Doctor {
    nombre: string;
    matricula: string;
    curp: string;
    rfc: string;
    especialidades: string[];
    fotoUrl: string;
    // Datos de la cita/asistencia
    fecha: string;
    hora: string;
    mesa: string;
    turno: string;
    modalidad: string;
    estatus: string;
    verificacion: string;
}

@Component({
    selector: 'app-asistencia-extraordinaria',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        ChipModule,
        DividerModule,
        MenuAsistenciasComponent
    ],
    templateUrl: './asistencia-extraordinaria.component.html',
    styleUrls: ['./asistencia-extraordinaria.component.scss']
})
export class AsistenciaExtraordinariaComponent {
    searchQuery: string = '';
    doctor: Doctor | null = null;
    loading: boolean = false;

    // Simulación de búsqueda
    search() {
        if (!this.searchQuery) return;

        this.loading = true;

        // Simulamos un delay de red y asignamos datos estáticos basados en la imagen 2
        setTimeout(() => {
            this.doctor = {
                nombre: 'Dr. Pablo Andrés García Bernal',
                matricula: '98161651',
                curp: 'BBPA841316HDFLRR01',
                rfc: 'BBPA841316HDF',
                especialidades: ['Cardiología', 'Anestesiología pediátrica', 'Neumología'],
                fotoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg', // Placeholder
                fecha: '15 de Mayo, 2025',
                hora: '07:00 Hrs.',
                mesa: 'Mesa 5',
                turno: '11:00 a 13:00 hrs.',
                modalidad: 'Externo',
                estatus: 'Concluido',
                verificacion: 'Sin verificación documental'
            };
            this.loading = false;
        }, 500);
    }

    clear() {
        this.searchQuery = '';
        this.doctor = null;
    }

    register() {
        console.log('Registrando asistencia para:', this.doctor?.nombre);
        // Lógica de guardado aquí
    }

    delete() {
        this.clear();
    }
}