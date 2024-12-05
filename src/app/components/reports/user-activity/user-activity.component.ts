import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivityRecord } from '../../ActivityRecord';
import { ActivityRecordService } from '../activity-record.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent implements OnInit {
  activityRecords: ActivityRecord[] = [];
  totalElements: number | undefined;
  filterForm: FormGroup;

  constructor(
    private activityRecordService: ActivityRecordService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      userId: [2],
      date: [''],
      workItemId: [''],
      pageIndex: [0],
      pageSize: [10]
    });
  }

  ngOnInit(): void {
  }

  loadRecordsByDate() {
    const { userId, date, pageIndex, pageSize } = this.filterForm.value;
    this.activityRecordService.getActivitiesRecordsByDate(userId, date, pageIndex, pageSize).subscribe(response => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
      console.log(this.activityRecords);
    });
  }

  loadRecordsByWorkItemID() {
    const { userId, workItemId, pageIndex, pageSize } = this.filterForm.value;
    this.activityRecordService.getActivitiesRecordsByWorkItemID(userId, workItemId, pageIndex, pageSize).subscribe(response => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
    });
  }
}