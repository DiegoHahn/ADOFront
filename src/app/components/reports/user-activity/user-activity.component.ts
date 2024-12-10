import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityRecord } from '../../ActivityRecord';
import { ActivityRecordService } from '../activity-record.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent{
  activityRecords: ActivityRecord[] = [];
  totalElements: number | undefined;
  filterForm: FormGroup;
  readonly DEFAULT_PAGE_SIZE = 11;
  totalTrackedTime: string = '00:00:00';

  constructor(
    private activityRecordService: ActivityRecordService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      userId: [2],
      date: ['', Validators.required],
      workItemId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      pageIndex: [0],
      pageSize: [10]
    });
  }

  //retorna as linhas vazias
  get emptyRows(): any[] {
    return Array(this.DEFAULT_PAGE_SIZE).fill({
      workItemId: '',
      title: '',
      startTime: '',
      currentTrackedTime: ''
    });
  }

  //retorna as linhas preenchidas mais as linhas vazias
  get displayRows(): any[] {
    const dataRows = this.activityRecords;
    const totalRowCount = this.DEFAULT_PAGE_SIZE - 1;
    const emptyRowCount = totalRowCount - dataRows.length;
    const emptyRows = Array(emptyRowCount > 0 ? emptyRowCount : 0).fill({
      workItemId: '',
      title: '',
      startTime: '',
      currentTrackedTime: ''
    });
    return [...dataRows, ...emptyRows];
  }

  loadRecordsByDate() {
    if (this.filterForm.get('date')?.valid) {
      const { userId, date, pageIndex, pageSize } = this.filterForm.value;
      this.activityRecordService.getActivitiesRecordsByDate(userId, date, pageIndex, pageSize)
        .subscribe(response => {
          this.activityRecords = response.content;
          this.totalElements = response.totalElements;
          this.resetDateField();
          this.calculateTotalTrackedTime();
        });
    }
  }

  loadRecordsByWorkItemID() {
    if (this.filterForm.get('workItemId')?.valid) {
      const { userId, workItemId, pageIndex, pageSize } = this.filterForm.value;
      this.activityRecordService.getActivitiesRecordsByWorkItemID(userId, workItemId, pageIndex, pageSize)
        .subscribe(response => {
          this.activityRecords = response.content;
          this.totalElements = response.totalElements;
          this.resetWorkItemField();
          this.calculateTotalTrackedTime()
        });
    }
  }

  private resetDateField() {
    this.filterForm.patchValue({
      date: ''
    });
  }

  private resetWorkItemField() {
    this.filterForm.patchValue({
      workItemId: ''
    });
  }

  isDateSearchDisabled(): boolean {
    return !this.filterForm.get('date')?.valid;
  }

  isWorkItemSearchDisabled(): boolean {
    return !this.filterForm.get('workItemId')?.valid;
  }

  calculateTotalTrackedTime() {
    let totalSeconds = this.activityRecords.reduce((total, record) => {
      if (record.currentTrackedTime) {
        const timeParts = record.currentTrackedTime.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
        return total + hours * 3600 + minutes * 60 + seconds;
      }
      return total;
    }, 0);

    // Converter total de segundos para HH:mm:ss
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    this.totalTrackedTime = `${this.padWithZero(hours)}:${this.padWithZero(minutes)}:${this.padWithZero(seconds)}`;
  }

  // Método auxiliar para adicionar zero à esquerda
  padWithZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
}