import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserInformation } from './user-information';


// @Injectable({
//   providedIn: 'root'
// })
// export class PersonalDataService {
//   private apiUrl = 'http://localhost:8080/userInformation';

//   constructor(private http: HttpClient) { }

//   getAzureUserIDByEmail(email: string): Observable<string> {
//     return this.http.get(`${this.apiUrl}/azureUserID/${email}`, { responseType: 'text' })
//       .pipe(
//         map(response => {
//           try {
//             const jsonResponse = JSON.parse(response);
//             return jsonResponse.azureUserID;
//           } catch (error) {
//           return response;
//           }
//         })
//       );
//   }

//   saveUserInfo(userInformation: UserInformation): Observable<UserInformation> {
//     return this.http.post<UserInformation>(this.apiUrl, userInformation);
//   }

//   getUserInformation(email: string): Observable<UserInformation> {
//     return this.http.get<UserInformation>(`${this.apiUrl}/${email}`);
//   }
// }
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

  saveUserInfo(userInformation: UserInformation): Observable<UserInformation> {
    return this.http.post<UserInformation>(this.apiUrl, userInformation);
  }

  getUserInformation(email: string): Observable<UserInformation> {
    const body = { email: email };
    return this.http.post<UserInformation>(`${this.apiUrl}/details`, body);
  }
}
