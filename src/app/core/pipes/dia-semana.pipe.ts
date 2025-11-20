import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diaSemana'
})
export class DiaSemanaPipe implements PipeTransform {

  /**
   * Transforma un número (1 a 7) en el nombre del día de la semana.
   * @param value El número del día de la semana (1=Lunes, 7=Domingo).
   * @param args Argumentos adicionales (no usados en este caso).
   * @returns El nombre del día de la semana o una cadena de error.
   */
  transform(value: number): string {
    const dias: { [key: number]: string } = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo'
    };

    if (value >= 1 && value <= 7) {
      // Retorna el día de la semana
      return dias[value];
    } else {
      // Retorna un mensaje de error o valor predeterminado si el número no es válido
      return 'Día inválido';
    }
  }
}
