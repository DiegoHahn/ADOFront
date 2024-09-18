import { Component } from '@angular/core';
import { TimerService } from '../../timer.service';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent {
  isTimerRunning = false; 

  constructor(private timerService: TimerService) {}

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
  }

  exit() {
    console.log("Exit");
  }
}