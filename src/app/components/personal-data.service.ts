import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private apiUrl = 'http://localhost:8080/userSK';

  constructor(private http: HttpClient) { }

  getUserSKByEmail(email: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/email/${email}`, { responseType: 'text' })
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
}