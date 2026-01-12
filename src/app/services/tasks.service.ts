import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSource = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSource.asObservable();

  constructor(private api: ApiService) {}

  loadTasks() {
    this.api.getTasks().subscribe({
      next: tasks => { this.tasksSource.next(tasks);
      console.log('Tasks loaded:', tasks);
      },
      error: err => console.error('Failed to load tasks:', err)
    });
  }
}
