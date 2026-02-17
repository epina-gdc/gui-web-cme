import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tituloCase'
})
export class TituloCase implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
