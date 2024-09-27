import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TargetWorkItem } from '../target-workItem';
import { WorkItemService } from '../work-item.service';

import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { PersonalDataService } from '../personal-data.service';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  form!: FormGroup
  workItems: TargetWorkItem[] = [];
  selectedWorkItem: TargetWorkItem | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private workItemService: WorkItemService,  
    private personalDataservice: PersonalDataService,
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
      completedWork: ['']
    });

    this.timerService.startTime$.subscribe(time => {
      this.form.get('startTime')?.setValue(time);
    });

    this.timerService.completedWork$.subscribe(completedWork => {
      this.form.get('completedWork')?.setValue(completedWork);
    });
    
    //PEGAR O VALOR DO BOARD (se for assim mesmo, encapsular em um método e o timer tambem)
    const userInformation = JSON.parse(localStorage.getItem('userInformation')!);

    if (userInformation) {
      this.form.get('board')?.setValue(userInformation.board);
    }

    if (!this.form.get('board')?.value) {
      this.router.navigate(['/personal-data']);
    }
  }

  //Vale a pena mudar o userSK no front e ter que fazer o map aqui?
  onUserStoryChange() {
    const userStoryId = this.form.get('userStoryId')?.value;
    if (userStoryId) {
      this.workItemService.getWorkItemsForUserStory(userStoryId).pipe(
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
          console.error('Erro ao buscar work items:', error);
          return of([]);
        })
      ).subscribe();
    }
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
