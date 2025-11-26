import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-header-generico',
  imports: [],
  templateUrl: './header-generico.component.html',
  styleUrl: './header-generico.component.scss'
})
export class HeaderGenericoComponent {

  constructor(
    public ref: DynamicDialogRef
  ) {
  }


  closeDialog(): void {
    this.ref.close('Data to return to opener');
  }

}
