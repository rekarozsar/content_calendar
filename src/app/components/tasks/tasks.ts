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
  console.log('[TasksComponent] ngOnInit start');

  this.tasks$ = this.taskService.tasks$;
  this.taskService.loadTasks();
  console.log('[TasksComponent] tasks loading triggered');

  await this.fetchUser();
  console.log('[TasksComponent] user after fetch:', this.user);

  this.userTasks$ = this.tasks$.pipe(
    map(tasks => {
      console.log('[userTasks$] all tasks:', tasks);

      if (!this.user) {
        console.warn('[userTasks$] user is null');
        return [];
      }

      const filtered = tasks.filter(task => {
        const isTextWriter = task.text_writer === this.user!.id;
        const isGraphicsMaker = task.graphics_maker === this.user!.id;

        console.log('[userTasks$] checking task', {
          taskId: task.id,
          text_writer: task.text_writer,
          graphics_maker: task.graphics_maker,
          userId: this.user!.id,
          isTextWriter,
          isGraphicsMaker
        });

        return isTextWriter || isGraphicsMaker;
      });

      console.log('[userTasks$] filtered tasks:', filtered);
      return filtered;
    })
  );
}
}