interface AuthUser {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

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
  user: AuthUser | null = null;


  selectTask(task: any) {
    this.eventService.selectEvent(task);
  }


  async fetchUser(): Promise<AuthUser | null> {
    try {
      // <-- no casting needed here
      const user = await firstValueFrom(this.auth.getUser());

      this.user = user as AuthUser; // tell TS this is the type we expect
      return this.user;
    } catch (err) {
      console.warn('Could not fetch user:', err);
      this.user = null;
      return null;
    }
  }



  async ngOnInit() {
    const user = await this.fetchUser();
    if (!user) return;
    // 1. Fetch users first
    this.api.getUsers().subscribe({
      next: users => {
        this.userMap = new Map(users.map(u => [u.id, u.name]));
        // 2. Then fetch tasks
        this.api.getTasks().subscribe({
          next: tasks => {
            const filteredTasks = tasks.filter(task =>
            task.graphics_maker === user.id ||
            task.text_writer === user.id
            );
            // 3. Build tasks exactly like CalendarComponent
            this.tasks = filteredTasks.map(task => {
              // determine type
              let type = 'other';
              if ((task.facebook_post || task.facebook_event) && (task.instagram_post || task.story)) type = 'facebook_instagram';
              else if (task.facebook_post || task.facebook_event) type = 'facebook';
              else if (task.instagram_post || task.story) type = 'instagram';
              else if (task.tiktok) type = 'discord';

              let roleText = '';
              if (!this.user) roleText = '';
              else {
                const isGraphics = task.graphics_maker === this.user.id;
                const isText = task.text_writer === this.user.id;

                if (isGraphics && isText) roleText = 'Graphics & Text';
                else if (isGraphics) roleText = 'Graphics';
                else if (isText) roleText = 'Text';
              }

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
                roleText,
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
