import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


// cleaned .

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/backend';

  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get CSRF cookie
  getCsrfCookie() {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true, responseType: 'text' });
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

  // Logout
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  get user() {
    return this.userSubject.value;
  }

  get isAdmin(): boolean {
    return !!this.user?.admin;
  }


}




