import { ActivityRecord } from './../../ActivityRecord';
import { Component } from '@angular/core';
import { ActivityRecordService } from '../activity-record.service';
import { ActivityRecordResponse } from '../../ActivityRecordResponse';

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

  loadClients(pageIndex: number, pageSize: number){
    this.activityRecordService.getActivitiesRecordsByDate('2', 0, 10).subscribe((response: ActivityRecordResponse) => {
      this.activityRecords = response.content;
      this.totalElements = response.totalElements;
      console.log(this.activityRecords);
    }); 
  }
}
