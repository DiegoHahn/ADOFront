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

  get isStartIncomplete(): boolean {
    return !this.form.get('board')?.value ||
           !this.form.get('userStoryId')?.value ||
           !this.form.get('task')?.value ||
           !this.form.get('originalEstimate')?.value ||
           !this.form.get('remainingWork')?.value;
  }

  get isStopIncomplete(): boolean {
    return !this.form.get('board')?.value ||
           !this.form.get('userStoryId')?.value ||
           !this.form.get('task')?.value ||
           !this.form.get('originalEstimate')?.value ||
           !this.form.get('remainingWork')?.value ||
           !this.form.get('startTime')?.value ||
           !this.form.get('completedWork')?.value;
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

  cancel() {
    this.timerService.resetTimer();
    this.isTimerRunning = false;
    const boardValue = this.form.get('board')?.value;
    const userIdValue = this.form.get('userId')?.value;

    this.form.reset({
      board: boardValue,
      userStoryId: '',
      concluded: false,
      task: null,
      originalEstimate: '',
      remainingWork: '',
      startTime: '',
      completedWork: '00:00:00',
      userId: userIdValue
    });
  }
}