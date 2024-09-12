import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TargetWorkItem } from './target-workItem';

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  private apiUrl = 'http://localhost:8080/workitems';

  constructor(private http: HttpClient) { }

  getWorkItemsForUserStory(userStoryId: string): Observable<TargetWorkItem[]> {
    return this.http.get<TargetWorkItem[]>(`${this.apiUrl}/userstory/${userStoryId}`);
  }
}