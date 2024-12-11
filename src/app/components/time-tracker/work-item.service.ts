import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CurrentTrackedTime } from '../CurrentTrackedTime';
import { TargetWorkItem } from './target-workItem';

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  private apiUrl = 'http://localhost:8080/workitems';
  private activityRecordUrl = 'http://localhost:8080/activityrecord';

  constructor(private http: HttpClient) { }

  getWorkItemsForUserStory(userStoryId: string, userId: string, board: string): Observable<TargetWorkItem[]> {
    const body = { userStoryId: userStoryId, userId: userId, board: board };
    return this.http.post<TargetWorkItem[]>(`${this.apiUrl}/userstory`, body);
  }

  saveRecord(record: CurrentTrackedTime): Observable<CurrentTrackedTime> { 
    return this.http.post(this.activityRecordUrl, record, { responseType: 'text' }).pipe(
      map(response => {
        return JSON.parse(response) as CurrentTrackedTime || null;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao salvar o item de trabalho:', error);
        return throwError(() => error);
      })
    );
  }
}