import { Component, OnInit } from '@angular/core';
import { firstValueFrom, map, Observable, combineLatest } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { FacebookOutline, InstagramOutline, DiscordOutline } from '@ant-design/icons-angular/icons';
import { EventService } from '../../services/event';


@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    NzIconModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  tasks: any[] = [];
  userMap = new Map<number, string>();

  
  constructor(
    private auth: AuthService,
    private api: ApiService,
    private iconService: NzIconService,
    private eventService: EventService
  ) {
    this.iconService.addIcon(
      FacebookOutline,
      InstagramOutline,
      DiscordOutline
    );
  }
  user: any = null;

  selectTask(task: any) {
    this.eventService.selectEvent(task);
  }


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

  ngOnInit() {
    // 1. Fetch users first
    this.api.getUsers().subscribe({
      next: users => {
        this.userMap = new Map(users.map(u => [u.id, u.name]));
        // 2. Then fetch tasks
        this.api.getTasks().subscribe({
          next: tasks => {
            // 3. Build tasks exactly like CalendarComponent
            this.tasks = tasks.map(task => {
              // determine type
              let type = 'other';
              if ((task.facebook_post || task.facebook_event) && (task.instagram_post || task.story)) type = 'facebook_instagram';
              else if (task.facebook_post || task.facebook_event) type = 'facebook';
              else if (task.instagram_post || task.story) type = 'instagram';
              else if (task.tiktok) type = 'discord';

              return {
                id: task.id,
                title: task.title,
                description: task.description,
                date: task.due_date,
                post_by: task.post_by,
                type,
                graphics_done: task.graphics_done,
                graphics: this.userMap.get(task.graphics_maker) ?? null,
                text_done: task.text_done,
                text: this.userMap.get(task.text_writer) ?? null,
                facebook_post: task.facebook_post,
                facebook_event: task.facebook_event,
                instagram_post: task.instagram_post,
                story: task.story,
                discord_post: task.tiktok,
                other_media: task.other_media ?? null
              };
            });
            console.log('Tasks built:', this.tasks);
          },
          error: err => console.error('ERROR fetching tasks:', err)
        });
      },
      error: err => console.error('ERROR fetching users:', err)
    });
  }
}
