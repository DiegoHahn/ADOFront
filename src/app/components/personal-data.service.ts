import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserInformation } from './user-information';


@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userInformation';

  constructor(private http: HttpClient) { }

  getUserSKByEmail(email: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/userSK/${email}`, { responseType: 'text' })
      .pipe(
        map(response => {
          try {
            // Tenta fazer o parse como JSON
            const jsonResponse = JSON.parse(response);
            return jsonResponse.userSK;
          } catch (error) {
            // Se falhar, assume que a resposta é o UserSK diretamente
            return response;
          }
        })
      );
    }

  saveUserInfo(userInformation: UserInformation): Observable<UserInformation> {
    return this.http.post<UserInformation>(this.apiUrl, userInformation);
  }
}