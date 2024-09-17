// import { Component } from '@angular/core';
// import { TimerService } from '../../timer.service';

// @Component({
//   selector: 'app-control-buttons',
//   templateUrl: './control-buttons.component.html',
//   styleUrls: ['./control-buttons.component.css']
// })
// export class ControlButtonsComponent {
//   private intervalId: any;
//   private seconds: number = 0;

//   constructor(private timerService: TimerService) {}

//   start() {
//     if (this.intervalId) {
//       return;
//     }
//     this.intervalId = setInterval(() => {
//       this.seconds++;
//       const time = this.formatTime(this.seconds);
//       this.timerService.updateTempo(time);
//     }, 1000);
//     this.timerService.updateStartTime(this.getTime());
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//   }

//   exit() {
//     console.log("Exit");
//   }

//   private formatTime(seconds: number): string {
//     const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
//     return `${hours}:${minutes}:${remainingSeconds}`;
//   }

//   getTime(): string {
//     const now = new Date();
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
//   }
// }
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