import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ActivityRecord } from "../ActivityRecord";


@Injectable()
  export class ActivityRecordService {
  private activityRecordUrl = `${environment.apiUrl}/activityRecord`;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getActivitiesRecordsByDate(userId: number, date: string): Observable<ActivityRecord[]>{
      let params = new HttpParams()
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      params = params
        .set('userId', userId);
      if (formattedDate) {
        params = params.set('date', formattedDate);
      }
      return this.http.get<ActivityRecord[]>(this.activityRecordUrl + '/byDate', {params})
  }

  getActivitiesRecordsByWorkItemId(userId: number, workItemId: number): Observable<ActivityRecord[]>{
    let params = new HttpParams()
    params = params
      .set('userId', userId)
      .set('workItemId', workItemId)
    return this.http.get<ActivityRecord[]>(this.activityRecordUrl + '/byWorkItemId', {params})
  }
}