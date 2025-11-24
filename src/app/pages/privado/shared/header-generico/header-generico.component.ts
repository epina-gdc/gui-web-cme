import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-header-generico',
  imports: [Button],
  templateUrl: './header-generico.component.html',
  styleUrl: './header-generico.component.scss'
})
export class HeaderGenericoComponent {

  constructor(
    public ref: DynamicDialogRef
  ) { }


  closeDialog(): void {
    this.ref.close('Data to return to opener');
  }

}
