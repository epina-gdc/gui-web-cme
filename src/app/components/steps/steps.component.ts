import {Component, input, Input, InputSignal} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'steps',
  imports: [
    NgClass
  ],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss'
})
export class StepsComponent {
  @Input() steps: any[] = [];
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
