import { Component } from '@angular/core';
import { firstValueFrom, map, Observable, combineLatest } from 'rxjs';
import { AuthService } from '../../services/auth';
import { TaskService } from '../../services/tasks.service';


@Component({
  selector: 'app-tasks',
  imports: [
    
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  tasks$!: Observable<any[]>;
  userTasks$!: Observable<any[]>;

  constructor(private auth: AuthService, private taskService: TaskService) {}
  user: any = null;

   

  async fetchUser() {
    try {
      const user = await firstValueFrom(this.auth.getUser());
      this.user = user;
      console.log('Fetched user:', user);
      return user;
    } catch (err) {
      console.warn('Could not fetch user (not authenticated or error):', err);
      this.user = null;
      return null;
    }
  }

  async ngOnInit() {
    this.tasks$ = this.taskService.tasks$;
    this.taskService.loadTasks(); 
    await this.fetchUser();

    console.log('[TasksComponent] user after fetch:', this.user);


  }
}
