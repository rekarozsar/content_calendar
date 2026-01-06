import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../components/calendar/calendar';
import { EventDetailsComponent } from '../../components/details/details';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ViewChild } from '@angular/core';
import { CreateEventComponent } from './../create-event/create-event';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { MenuOutline } from '@ant-design/icons-angular/icons';
import { NzIconService } from 'ng-zorro-antd/icon';

import { ApiService } from '../../api';



// cleaned 

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzIconModule,
    NzCardModule,
    CalendarComponent,
    EventDetailsComponent,
    CreateEventComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  @ViewChild(CreateEventComponent, { static: false })
createEventModal!: CreateEventComponent;

  constructor(private auth: AuthService, private router: Router, private iconService: NzIconService, private api: ApiService) {
      this.iconService.addIcon(MenuOutline);
    }
    user: any = null;

  openNewEvent() {
    console.log("Opening New Event Modal");
    console.log("Modal reference:", this.createEventModal);
      if (!this.createEventModal) {
        console.error("Modal component not found");
      } else {
        this.createEventModal.show();
      }
  }

  addEvent(event: any) {
    console.log('EVENT FROM MODAL:', event);

    const payload = {
      title: event.title,
      description: event.description,
      caption: event.caption || null,
      location: event.place || null,
      
      post_by: event.post_date
      ? new Date(
          new Date(event.post_date).setDate(
            new Date(event.post_date).getDate() + 1
          )
        ).toISOString()
      : null,


      due_date: event.date || null,

      facebook_post: event.type === 'facebook',
      facebook_event: false,
      instagram_post: event.type === 'instagram',
      story: false,
      tiktok: event.type === 'discord',
      // other_media: event.type === 'other' ? 'other' : null,

      images: event.photo ? [event.photo] : [],

      // UNDO LATER
      // graphics_maker: 2,
      // text_writer: 2,

      graphics_done: false,
      text_done: false,
      poster: false,
      priority: 1
    };

     // 🔥 THIS is what the backend sees
  console.log(
    'POST /api/tasks PAYLOAD (raw object):',
    payload
  );

  console.log(
    'POST /api/tasks PAYLOAD (JSON):',
    JSON.stringify(payload, null, 2)
  );

    this.api.createTask(payload).subscribe({
      next: res => {
        console.log('TASK CREATED:', res);
        // optionally trigger refresh
      },
      error: err => console.error('ERROR CREATING TASK:', err)
    });
  }


  async ngOnInit() {
    await this.fetchUser();
  }


  // Fetch the authenticated user and store in `this.user`.
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

  isAdmin(): boolean {
    return !!this.user?.admin;
  }

  
  async logout() {
    try {
      // Attempt to tell backend to invalidate server session
      try {
        await firstValueFrom(this.auth.logout());
      } catch (e) {
        console.warn('Backend logout request failed or not available:', e);
      }

      // Clear cookies for the current origin
      const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
      const hostname = window.location.hostname;
      const cookies = document.cookie ? document.cookie.split(';') : [];

      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Basic deletion
        document.cookie = `${name}=; Expires=${expire}; Path=/; SameSite=None; Secure`;
        // Try deleting for the hostname
        try {
          document.cookie = `${name}=; Expires=${expire}; Path=/; Domain=${hostname}; SameSite=None; Secure`;
          document.cookie = `${name}=; Expires=${expire}; Path=/; Domain=.${hostname}; SameSite=None; Secure`;
        } catch (e) {
          // ignoring invalid domain errors
        }
      }

      // Explicitly removing common Laravel cookie names 
      const common = ['XSRF-TOKEN', 'laravel-session', 'laravel_token', 'session'];
      for (const cname of common) {
        document.cookie = `${cname}=; Expires=${expire}; Path=/; SameSite=None; Secure`;
        try {
          document.cookie = `${cname}=; Expires=${expire}; Path=/; Domain=${hostname}; SameSite=None; Secure`;
          document.cookie = `${cname}=; Expires=${expire}; Path=/; Domain=.${hostname}; SameSite=None; Secure`;
        } catch (e) {}
      }

      this.user = null;
      console.log('Logged out and cleared cookies');
      await this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error during logout/clearing cookies:', err);
    }
  }
}
