import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserInformation } from './user-information';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userInformation';

  constructor(private http: HttpClient) { }

  saveUserInfo(userInformation: UserInformation): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveOrUpdate`, userInformation, { responseType: 'text' }).pipe(
      tap(response => {
        console.log('Resposta do servidor:', response);
      }),
      catchError(error => {
        console.error('Erro ao salvar ou atualizar dados:', error);
        return of(null);
      })
    );
  }
  getUserInformation(email: string): Observable<UserInformation> {
    const body = { email: email };
    return this.http.post<UserInformation>(`${this.apiUrl}/details`, body);
  }
}