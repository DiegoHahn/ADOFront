import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserInformation } from './user-information';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userInformation';

  constructor(private http: HttpClient) { }

  saveUserInfo(userInfo: any): Observable<string> {
    return this.http.post(this.apiUrl, userInfo, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao salvar ou atualizar dados:', error);
        return throwError(() => error);
      })
    );
  }
  
  getUserInformation(email: string): Observable<UserInformation> {
    const body = { email: email };
    return this.http.post<UserInformation>(`${this.apiUrl}/details`, body);
  }
}