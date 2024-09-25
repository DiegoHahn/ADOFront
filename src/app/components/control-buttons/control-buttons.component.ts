import { WorkItemService } from './../work-item.service';
import { Component } from '@angular/core';
import { TimerService } from '../timer.service';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent {
  isTimerRunning = false; 

  constructor(
    private timerService: TimerService,
    private workItemService: WorkItemService,
    private controlContainer: ControlContainer
  ) {}

  get form() {
    return this.controlContainer.control as FormGroup;
  }

  start() {
    if (!this.isTimerRunning) {
      this.timerService.startTimer();
      this.isTimerRunning = true;
    }
  }

  stop() {
    if (this.isTimerRunning) {
      this.timerService.stopTimer();
      this.isTimerRunning = false;
    }
    this.workItemService.saveWorkItem(this.form.value).subscribe();
  }

  exit() {
    console.log("Exit");
  }
}