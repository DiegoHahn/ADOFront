import { ActivityRecord } from './../../ActivityRecord';
import { Component } from '@angular/core';
import { ActivityRecordService } from '../activity-record.service';
import { ActivityRecordsPage } from '../../ActivityRecordsPage';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent {

  activityRecords: ActivityRecord[] = [];
  totalElements: number | undefined;

  constructor(
    private activityRecordService: ActivityRecordService
  ) { }

  ngOnInit(): void {
  }
  loadRecordsByDate(userID: number, date: string, pageIndex: number, pageSize: number){
    this.activityRecordService.getActivitiesRecordsByDate(userID, date, pageIndex, pageSize).subscribe((response: ActivityRecordsPage) => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
      console.log(this.activityRecords);
    }); 
  }

  loadRecordsByWorkItemID(userID: number, workItemID: number, pageIndex: number, pageSize: number){
    this.activityRecordService.getActivitiesRecordsByWorkItemID(userID, workItemID, pageIndex, pageSize).subscribe((response: ActivityRecordsPage) => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
      console.log(this.activityRecords);
    });
  }
}
