import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTimeSource = new BehaviorSubject<string>('');
  private currentTrackedTimeSource = new BehaviorSubject<string>('00:00:00');
  private stopTimer$ = new Subject<void>(); 

  startTime$ = this.startTimeSource.asObservable();
  currentTrackedTime$ = this.currentTrackedTimeSource.asObservable();

  startTimer() {
    const now = new Date();
    const isoString = now.toISOString();
    this.startTimeSource.next(isoString);

    interval(1000)
      .pipe(
        takeUntil(this.stopTimer$),
        map(seconds => this.formatTime(seconds)) 
      )
      .subscribe(time => this.currentTrackedTimeSource.next(time));
  }

  stopTimer() {
    this.stopTimer$.next();
  }

  resetTimer() {
    this.stopTimer();
    this.startTimeSource.next('');
    this.currentTrackedTimeSource.next('00:00:00');
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
  }
}