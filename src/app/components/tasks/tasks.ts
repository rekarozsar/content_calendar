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

    // Subscribe to refresh
    this.eventService.refresh$.subscribe(() => {
      this.loadTasks(); // fetch tasks again
    });

    this.loadTasks(); // initial load
  }


  async loadTasks() {
    if (!this.user) return;

    this.api.getUsers().subscribe({
      next: users => {
        this.userMap = new Map(users.map(u => [u.id, u.name]));

        this.api.getTasks().subscribe({
          next: tasks => {
            const filteredTasks = tasks.filter(task =>
              task.graphics_maker === this.user!.id ||
              task.text_writer === this.user!.id
            );

            this.tasks = filteredTasks.map(task => {
              let type = 'other';
              if ((task.facebook_post || task.facebook_event) && (task.instagram_post || task.story)) type = 'facebook_instagram';
              else if (task.facebook_post || task.facebook_event) type = 'facebook';
              else if (task.instagram_post || task.story) type = 'instagram';
              else if (task.tiktok) type = 'discord';

              const isGraphics = task.graphics_maker === this.user!.id;
              const isText = task.text_writer === this.user!.id;

              let roleText = '';
              if (isGraphics && isText) roleText = 'Graphics & Text';
              else if (isGraphics) roleText = 'Graphics';
              else if (isText) roleText = 'Text';

              return {
                ...task,
                type,
                graphics: this.userMap.get(task.graphics_maker) ?? null,
                text: this.userMap.get(task.text_writer) ?? null,
                roleText
              };
            });

            console.log('Tasks loaded:', this.tasks);
          },
          error: err => console.error('ERROR fetching tasks:', err)
        });
      },
      error: err => console.error('ERROR fetching users:', err)
    });
  }


  async signOff(task: any) {
    if (!this.user) return;

    const payload: any = {};

    // Check which roles the current user has
    if (task.graphics === this.user.name) payload.graphics_maker = null;
    if (task.text === this.user.name) payload.text_writer = null;

    if (Object.keys(payload).length === 0) {
      alert('You are not signed up for this task.');
      return;
    }

    try {
      console.log('Sign off payload:', payload);
      const updated = await firstValueFrom(this.api.updateTask(task.id, payload));
      console.log('API response:', updated);

      // Merge the updated fields into the local task object
      Object.assign(task, updated);

      // Recompute roleText
      const isGraphics = task.graphics_maker === this.user.id;
      const isText = task.text_writer === this.user.id;

      if (isGraphics && isText) task.roleText = 'Graphics & Text';
      else if (isGraphics) task.roleText = 'Graphics';
      else if (isText) task.roleText = 'Text';
      else task.roleText = '';

      alert('You have been removed from this task.');
      this.eventService.selectEvent(null); 

      this.eventService.triggerRefresh();
    } catch (err) {
      console.error('Sign off failed:', err);
      alert('Sign off failed.');
    }
  }

  async Done(task: any) {
    if (!this.user) return;

    const isGraphics = task.graphics === this.user.name;
    const isText = task.text === this.user.name;

    if (!isGraphics && !isText) {
      alert('You are not assigned to this task.');
      return;
    }

    // Determine new values (toggle)
    const payload: any = {};
    if (isGraphics) payload.graphics_done = !task.graphics_done;
    if (isText) payload.text_done = !task.text_done;

    try {
      const updated = await firstValueFrom(this.api.updateTask(task.id, payload));
      
      Object.assign(task, updated);  // merge changes

      // Optionally, recompute roleText (if needed)
      const g = task.graphics_done ? 'Graphics' : '';
      const t = task.text_done ? 'Text' : '';
      task.roleText = g && t ? 'Graphics & Text' : g || t || task.roleText;

      this.eventService.triggerRefresh();

    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task.');
    }
  }


  getDoneText(task: any): string {
    if (!this.user) return 'Mark as done';

    const isGraphics = task.graphics === this.user.name;
    const isText = task.text === this.user.name;

    const graphicsDone = isGraphics ? task.graphics_done : false;
    const textDone = isText ? task.text_done : false;

    // If any role of the current user is done, show "Undo done"
    if ((isGraphics && graphicsDone) || (isText && textDone)) return 'Undo done';
    return 'Mark as done';
  }

  getDoneClass(task: any): string {
    if (!this.user) return 'not-done-btn';

    const isGraphics = task.graphics === this.user.name;
    const isText = task.text === this.user.name;

    const graphicsDone = isGraphics ? task.graphics_done : false;
    const textDone = isText ? task.text_done : false;

    return (graphicsDone || textDone) ? 'done-btn' : 'not-done-btn';
  }




}
