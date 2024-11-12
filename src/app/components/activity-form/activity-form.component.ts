import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { TimerService } from '../timer.service';
import { WorkItemService } from '../work-item.service';
import { PersonalDataService } from '../personal-data.service';
import { TargetWorkItem } from '../target-workItem';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  workItems: TargetWorkItem[] = [];
  selectedWorkItem: TargetWorkItem | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private workItemService: WorkItemService,
    public timerService: TimerService,
    private router: Router,
    private personalDataService: PersonalDataService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.form = this.formBuilder.group({
      board: [''],
      userStoryId: [''],
      concluded: [false],
      task: [null],
      originalEstimate: [''],
      remainingWork: [''],
      startTime: [''],
      completedWork: [''],
      userId: ['']
    });
    this.form.get('board')?.disable({ emitEvent: false });
    this.setupTimerSubscriptions();
    this.loadUserInformationFromDatabase(email || '');

    this.timerService.resetTimer();
    this.form.reset({
      board: { value: '', disable: 'true'},
      userStoryId: '',
      concluded: false,
      task: null,
      originalEstimate: '',
      remainingWork: '',
      startTime: '',
      completedWork: '',
      userId: ''
    });
  }

  ngOnDestroy() {
    this.timerService.stopTimer();
    this.timerService.resetTimer();
  }

  private setupTimerSubscriptions() {
    this.timerService.startTime$.subscribe(time => {
      this.form.get('startTime')?.setValue(time);
    });
    this.timerService.completedWork$.subscribe(completedWork => {
      this.form.get('completedWork')?.setValue(completedWork);
    });
  }

  private loadUserInformationFromDatabase(email: string) {
    if (!email) {
      this.errorMessage = 'Erro ao carregar informações do usuário.';
        return;
    }
    this.personalDataService.getUserInformation(email).pipe(
      tap(userInformation => {
        if (userInformation) {
          this.form.patchValue({
            board: userInformation.board,
            userId: userInformation.userId
          });
        }
        if (!this.form.get('board')?.value) {
          this.router.navigate(['/personal-data']);
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar informações do usuário:', error);
        return of(null);
      })
    ).subscribe();
  }

  onUserStoryChange() {
    const userStoryId = this.form.get('userStoryId')?.value;
    const userId = this.form.get('userId')?.value;
    const board = this.form.get('board')?.value;

    this.errorMessage = null;
    this.workItems = [];
    this.form.get('task')?.reset();
    this.form.get('originalEstimate')?.reset();
    this.form.get('remainingWork')?.reset();

    if (userStoryId && userId && board) {
      this.loadWorkItems(userStoryId, userId, board);
    }
  }

  private loadWorkItems(userStoryId: string, userId: string, board: string) {
    this.workItemService.getWorkItemsForUserStory(userStoryId, userId, board).pipe(
      map((items: any[]) => items.map(item => ({
        ...item,
        assignedToAzureUserID: item.assignedToUserSK
      }))),
      tap((items: TargetWorkItem[]) => {
        this.workItems = items;
        if (this.workItems.length > 0) {
          this.selectedWorkItem = this.workItems[0];
          this.form.get('task')?.setValue(this.selectedWorkItem);
          this.onWorkItemSelect();
        } else {
          this.ngZone.run(() => {
            this.errorMessage = 'Nenhuma task encontrada para a User Story informada.';
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar dados:', error);
        this.ngZone.run(() => {
          this.errorMessage = 'Erro ao buscar tasks. Verifique os dados de usuário informados';
        });
        return of([]);
      })
    ).subscribe();
  }

  onWorkItemSelect() {
    const selectedWorkItem = this.form.get('task')?.value;
    if (selectedWorkItem) {
      this.form.patchValue({
        originalEstimate: selectedWorkItem.originalEstimate,
        remainingWork: selectedWorkItem.remainingWork
      });
    }
  }

  handleStatus(status: { type: string, message: string }) {
    if (status.type === 'success') {
      this.successMessage = status.message;
      this.errorMessage = null;
    } else if (status.type === 'error') {
      this.errorMessage = status.message;
      this.successMessage = null;
    } else if (status.type === 'clear') {
      this.successMessage = null;
      this.errorMessage = null;
    }
  }
}