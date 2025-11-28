import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://calendar-api-vpl7.onrender.com';

  constructor(private http: HttpClient) {}


  login(credentials: any) {
  return this.http.post(`${this.apiUrl}/api/login`, credentials)
    .pipe(
      catchError((error) => {
        console.error('Login API error:', error);
        return throwError(() => error);
      })
    );
}


  /*
  login(data: { email: string; password: string }) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, data)
    );
  }
  */

  
}
