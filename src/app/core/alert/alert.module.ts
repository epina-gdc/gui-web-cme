import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertComponent} from './alert.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule,NgbAlertModule],
    declarations: [AlertComponent],
    exports: [AlertComponent]
})
export class AlertModule { }
