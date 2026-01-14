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

  createUser(user: any) {
    return this.http.post('/backend/api/users', user);
  }

  updateUser(id: number, payload: any) {
    return this.http.put(`/backend/api/users/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete(`/api/users/${id}`);
  }


  createTask(task: any) {
    return this.http.post('/backend/api/tasks', task);
  }

  
  updateTask(id: number, payload: any) {
    return this.http.put(`/backend/api/tasks/${id}`, payload);
  }

  /*
  updateTask(id: number, payload: any) {
    return this.http.put(
      `${this.baseUrl}/api/tasks/${id}`,
      payload,
      { withCredentials: true }
    );
  }
    */


  deleteTask(id: number) {
    return this.http.delete(`/backend/api/tasks/${id}`);
  }



}
