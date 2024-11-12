import { WorkItemService } from './../work-item.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { TimerService } from '../timer.service';
import { ControlContainer, FormGroup } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent {
  isTimerRunning = false; 
  @Output() statusChanged = new EventEmitter<{ type: string, message: string }>();

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
    this.form.get('board')?.enable({ emitEvent: false });
    this.workItemService.saveWorkItem(this.form.value).pipe(
      tap(() => {
        this.statusChanged.emit({ type: 'success', message: 'Registro salvo com sucesso!' });
        setTimeout(() => (this.resetForm()), 2000)
      }),
      catchError(error => {
        if (error.status === 401) {
          this.statusChanged.emit({ type: 'error', message: 'Token expirado. Ao atualizar os dados de usuário esse registro sera salvo automaticamente' });
        }
        return of(null);
      })
    ).subscribe();
  }

  cancel() {
    this.isTimerRunning = false;
    this.resetForm();
  }

  resetForm(){
    this.timerService.resetTimer();
    const boardValue = this.form.get('board')?.value;
    const userIdValue = this.form.get('userId')?.value;
    this.form.reset({
      board: {value:boardValue, disabled: 'true' },
      userStoryId: '',
      concluded: false,
      task: null,
      originalEstimate: '',
      remainingWork: '',
      startTime: '',
      completedWork: '00:00:00',
      userId: userIdValue
    });

    this.statusChanged.emit({ type: 'clear', message: '' });
  }
}