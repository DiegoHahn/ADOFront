import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
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

  saveWorkItem(workItem: any): Observable<any> {
    return this.http.post(this.activityRecordUrl, workItem, { responseType: 'text' }).pipe(
      map(response => {
        return response || {};
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao salvar o item de trabalho:', error);
        return throwError(() => error);
      })
    );
  }
}