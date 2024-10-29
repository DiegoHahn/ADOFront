import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TargetWorkItem } from '../target-workItem';
import { WorkItemService } from '../work-item.service';

import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { TimerService } from '../timer.service';
import { UserInformation } from '../user-information';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {
  form!: FormGroup;
  workItems: TargetWorkItem[] = [];
  selectedWorkItem: TargetWorkItem | null = null;
 
  constructor(
    private formBuilder: FormBuilder,
    private workItemService: WorkItemService,  
    public timerService: TimerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      board: [''],
      userStoryId: [''],
      concluded: [false],
      task: [null],
      originalEstimate: [],
      remainingWork: [],
      startTime: [],
      completedWork: [''],
      userId: [''] 
    });

    this.setupTimerSubscriptions();
    this.loadUserInformation();
  }

  private setupTimerSubscriptions() {
    this.timerService.startTime$.subscribe(time => {
      this.form.get('startTime')?.setValue(time);
    });
    this.timerService.completedWork$.subscribe(completedWork => {
      this.form.get('completedWork')?.setValue(completedWork);
    });
  }

  private loadUserInformation() {
    const userInformation = this.getUserInformationFromStorage();
    if (userInformation) {
      this.form.get('board')?.setValue(userInformation.board); //TODO: pegar do banco de dados ao invez do localStorage
      this.form.get('userId')?.setValue(userInformation.userId);
    }
    if (!this.form.get('board')?.value) {
      this.router.navigate(['/personal-data']);
    }
  }

  private getUserInformationFromStorage(): UserInformation {
    return JSON.parse(localStorage.getItem('userInformation') || 'null');
  }

  onUserStoryChange() {
    const userStoryId = this.form.get('userStoryId')?.value;
    const userInformation = this.getUserInformationFromStorage();
    const userId = userInformation?.userId;

    if (userStoryId && userId) {
      this.loadWorkItems(userStoryId, userId);
    }
  }

  private loadWorkItems(userStoryId: string, userId: string) {
    this.workItemService.getWorkItemsForUserStory(userStoryId, userId).pipe(
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
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar dados:', error);
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
}