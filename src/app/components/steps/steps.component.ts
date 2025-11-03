import {Component, EventEmitter, input, Input, InputSignal, Output} from '@angular/core';
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
  @Output() stepClick = new EventEmitter<number>();

  handleStepClick(index: number): void {
    this.stepClick.emit(index);
  }

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
