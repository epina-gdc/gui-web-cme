import {Component, input, Input, InputSignal} from '@angular/core';
import {NgClass} from '@angular/common';
import {StepItemInterno} from '@models/step-item.interface';

@Component({
  selector: 'steps',
  imports: [
    NgClass
  ],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss'
})
export class StepsComponent {
  @Input() steps: StepItemInterno[] = [];
  currentStepIndex: InputSignal<number> = input(1);

  getStepClass(index: number): string {
    if (index === this.currentStepIndex()) {
      return 'stepper-step-active';
    } else if (index < this.currentStepIndex()) {
      return 'stepper-step-done';
    } else {
      return 'stepper-step-pending';
    }
  }
}
