import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { UserInformation } from './user-information';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userInformation';

  constructor(private http: HttpClient) { }

  // saveUserInfo(userInformation: UserInformation): Observable<any> {
  //   return this.http.post(this.apiUrl, userInformation, { responseType: 'text' }).pipe(
  //     tap(response => {
  //       console.log('Resposta do servidor:', response);
  //     }),
  //     catchError(error => {
  //       console.error('Erro ao salvar ou atualizar dados:', error);
  //       return of(null);
  //     })
  //   );
  // }
  saveUserInfo(userInfo: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/userInformation', userInfo).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao salvar ou atualizar dados:', error);
        return throwError(error);
      })
    );
  }
  
  getUserInformation(email: string): Observable<UserInformation> {
    const body = { email: email };
    return this.http.post<UserInformation>(`${this.apiUrl}/details`, body);
  }
}