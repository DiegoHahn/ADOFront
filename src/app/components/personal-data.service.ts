import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UserInformation } from './user-information';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userInformation';

  constructor(private http: HttpClient) { }

  getAzureUserIDByEmail(email: string): Observable<string> {
    const body = { email: email };
    return this.http.post(`${this.apiUrl}/azureUserID`, body, { responseType: 'text' })
      .pipe(
        map(response => {
          try {
            const jsonResponse = JSON.parse(response);
            return jsonResponse.azureUserID;
          } catch (error) {
            return response;
          }
        })
      );
  }

  //vai servir apenas como um update pro board
  saveUserInfo(userInformation: UserInformation): Observable<UserInformation> {
    return this.http.post<UserInformation>(this.apiUrl, userInformation);
  }

  getUserInformation(email: string): Observable<UserInformation> {
    const body = { email: email };
    return this.http.post<UserInformation>(`${this.apiUrl}/details`, body);
  }

  validateAzureToken(email: string, azureToken: string): Observable<any> {
    const body = { email, token: azureToken };
    return this.http.post(`${this.apiUrl}/azureUserID`, body).pipe(
      catchError(error => {
        console.error('Erro ao validar token:', error);
        return of(null);
      })
    );
  }
}
