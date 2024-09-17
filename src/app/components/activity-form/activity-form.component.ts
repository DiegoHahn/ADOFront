import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TargetWorkItem } from '../target-workItem';
import { WorkItemService } from '../work-item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TimerService } from '../../timer.service';
import { catchError, of, tap } from 'rxjs';

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
    public timerService: TimerService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      board: [{ value: 'TR TAX', disabled: true }],
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
  }

  onUserStoryChange() {
    const userStoryId = this.form.get('userStoryId')?.value;
    if (userStoryId) {
      this.workItemService.getWorkItemsForUserStory(userStoryId).pipe(
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

  valorForm(){
    console.log(this.form.value);
  }

  onSettingsClick() {
    throw new Error('Method not implemented.');
    }
}
