import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTimeSource = new BehaviorSubject<string>('');
  private completedWorkSource = new BehaviorSubject<string>('00:00:00');
  private stopTimer$ = new Subject<void>(); 

  startTime$ = this.startTimeSource.asObservable();
  completedWork$ = this.completedWorkSource.asObservable();

  startTimer() {
    this.startTimeSource.next(this.getCurrentTime());
    interval(1000)
      .pipe(
        takeUntil(this.stopTimer$),
        map(seconds => this.formatTime(seconds)) 
      )
      .subscribe(time => this.completedWorkSource.next(time));
  }

  stopTimer() {
    this.stopTimer$.next();
  }

  resetTimer() {
    this.stopTimer();
    this.startTimeSource.next('');
    this.completedWorkSource.next('00:00:00');
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}