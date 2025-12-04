import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use a relative `/backend` path so requests go through the frontend proxy (same origin)
  private apiUrl = '/backend';

  constructor(private http: HttpClient) {}

  // Get CSRF cookie
  getCsrfCookie() {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true });
  }

  // Login
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  // Fetch authenticated user
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  getUser() {
    // Try to read the XSRF token cookie and include it as a header.
    const xsrf = this.getCookie('XSRF-TOKEN');
    const headers = xsrf ? new HttpHeaders({ 'X-XSRF-TOKEN': xsrf }) : undefined;
    return this.http.get(`${this.apiUrl}/api/me`, { withCredentials: true, headers });
  }

  // Logout (tell backend to invalidate session and clear cookies)
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
}






  /*
  login(credentials: any) {
  return this.http.post(`${this.apiUrl}/api/login`, credentials)
    .pipe(
      catchError((error) => {
        console.error('Login API error:', error);
        return throwError(() => error);
      })
    );
}*/


  /*
  login(data: { email: string; password: string }) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, data)
    );
  }
  */



