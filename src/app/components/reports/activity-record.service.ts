import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ActivityRecordResponse } from "../ActivityRecordResponse";


@Injectable({
    providedIn: 'root'
  })
  export class ActivityRecordService {
    private activityRecordUrl = 'http://localhost:8080/activityrecord';
  
    constructor(private http: HttpClient) { }
  
    getActivitiesRecordsByDate(userId: string, pageIndex: number, pageSize: number): Observable<ActivityRecordResponse>{
        let params = new HttpParams()
        params = params
          .set('userId', userId)
          .set('page', pageIndex)
          .set('size', pageSize);
        return this.http.get<ActivityRecordResponse>(this.activityRecordUrl, {params})
    }
  }