import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TargetWorkItem } from './target-workItem';

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  private apiUrl = 'http://localhost:8080/workitems';
  private activityRecordUrl = 'http://localhost:8080/activityrecord';

  constructor(private http: HttpClient) { }

  getWorkItemsForUserStory(userStoryId: string, email: string): Observable<TargetWorkItem[]> {
    return this.http.get<TargetWorkItem[]>(`${this.apiUrl}/userstory/${userStoryId}?email=${email}`);
  }

  saveWorkItem(workItem: TargetWorkItem): Observable<TargetWorkItem> {
    return this.http.post<TargetWorkItem>(this.activityRecordUrl, workItem);
  }
}