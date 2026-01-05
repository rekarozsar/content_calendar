import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://calendar-api-vpl7.onrender.com'; 

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>('/backend/api/tasks');
  }

  getUsers() {
    return this.http.get<any[]>('/backend/api/users');
  }

  getUser(id: number) {
    return this.http.get<any>(`/backend/api/users/${id}`);
  }

  createTask(task: any) {
    return this.http.post('/backend/api/tasks', task);
  }



}
