import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ActivityRecordsPage } from "../ActivityRecordsPage";
import { DatePipe } from "@angular/common";


@Injectable()
  export class ActivityRecordService {
  private activityRecordUrl = 'http://localhost:8080/activityrecord';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getActivitiesRecordsByDate(userId: number, date: string,  pageIndex: number, pageSize: number): Observable<ActivityRecordsPage>{
      let params = new HttpParams()
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      params = params
        .set('userId', userId);
      if (formattedDate) {
        params = params.set('date', formattedDate);
      }
      params = params
        .set('page', pageIndex)
        .set('size', pageSize);
      return this.http.get<ActivityRecordsPage>(this.activityRecordUrl + '/byDate', {params})
  }

  getActivitiesRecordsByWorkItemID(userId: number, workItemID: number, pageIndex: number, pageSize: number): Observable<ActivityRecordsPage>{
    let params = new HttpParams()
    params = params
      .set('userId', userId)
      .set('workItemID', workItemID)
      .set('page', pageIndex)
      .set('size', pageSize);
    return this.http.get<ActivityRecordsPage>(this.activityRecordUrl + '/byWorkItemID', {params})
  }
}