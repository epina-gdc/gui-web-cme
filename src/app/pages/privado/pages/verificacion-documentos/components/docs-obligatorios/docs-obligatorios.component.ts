import { Component } from '@angular/core';
import { HeaderTabComponent } from '@components/header-tab/header-tab.component';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-docs-obligatorios',
  imports: [TabsModule, HeaderTabComponent],
  templateUrl: './docs-obligatorios.component.html',
  styleUrl: './docs-obligatorios.component.scss'
})
export class DocsObligatoriosComponent {

}
