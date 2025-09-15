import { Component } from '@angular/core';
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
  steps = [
    { label: 'Personal', active: false },
    { label: 'Seat', active: true },
    { label: 'Payment', active: false },
  ];

  currentStepIndex: number = 1;

  getStepClass(index: number): string {
    if (index === this.currentStepIndex) {
      return 'stepper-step-active';
    } else if (index < this.currentStepIndex) {
      return 'stepper-step-done';
    } else {
      return 'stepper-step-pending';
    }
  }
}
