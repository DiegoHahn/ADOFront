import { ActivityRecord } from './../../ActivityRecord';
import { Component } from '@angular/core';
import { ActivityRecordService } from '../activity-record.service';
import { ActivityRecordsPage } from '../../ActivityRecordsPage';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.css'
})
export class UserActivityComponent {

  activityRecords: ActivityRecord[] = [];
  totalElements: number | undefined;

  constructor(
    private activityRecordService: ActivityRecordService
  ) { }

  ngOnInit(): void {
  }

  loadClients(userID: number, date: String, pageIndex: number, pageSize: number){
    this.activityRecordService.getActivitiesRecordsByDate(2, '28/11/2024', 0, 10).subscribe((response: ActivityRecordsPage) => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
      console.log(this.activityRecords);
    }); 
  }
}
