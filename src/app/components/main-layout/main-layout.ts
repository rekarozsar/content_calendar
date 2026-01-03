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


  //constructor() {}

  openNewEvent() {
    console.log("Opening New Event Modal");
    console.log("Modal reference:", this.createEventModal);
      if (!this.createEventModal) {
        console.error("Modal component not found");
      } else {
        this.createEventModal.show();
      }
  }

  addEvent(eventData: any) {
    console.log("New Event:", eventData);

    // Insert into your calendar event map
    const dateKey = eventData.date
      ? eventData.date.toISOString().split('T')[0]
      : 'no-date';

    /*
    if (!this.eventService.events.has(dateKey)) {
      this.eventService.events.set(dateKey, []);
    }

    this.eventService.events.get(dateKey)!.push(eventData);

    // If needed: update UI
    this.eventService.refreshEvents();
  }
    */
  }

    constructor(private auth: AuthService) {}

    user: any = null;


  async testLogin() {
  try {
    // Step 1: Get CSRF cookie
    console.log('Getting CSRF cookie...');
    await firstValueFrom(this.auth.getCsrfCookie());
    console.log('CSRF cookie obtained.');
    const cookie = document.cookie;
    console.log('Current cookies:', cookie);

    // Step 2: Login
    console.log('Logging in...');
    const loginResult = await firstValueFrom(this.auth.login('asd@asd.asd', 'asdasdasd'));
    console.log('Login result:', loginResult);

    // Step 3: Get user
    console.log('Fetching authenticated user...');
    const user = await firstValueFrom(this.auth.getUser());
    console.log('Authenticated user:', user);
    this.user = user;
  } catch (err) {
    console.error('Login failed', err);
  }

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

  // Clear common Laravel / Sanctum cookies for the current origin and optionally tell the backend to logout.
  // This attempts to POST to the proxied `/backend/logout` endpoint and then remove cookies from the browser.
  async logout() {
    try {
      // Attempt to tell backend to invalidate server session (if proxied `/backend/logout` exists)
      try {
        await firstValueFrom(this.auth.logout());
      } catch (e) {
        console.warn('Backend logout request failed or not available:', e);
      }

      // Clear cookies for the current origin. We'll try a few variants (host and .host).
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
          // ignore invalid domain errors
        }
      }

      // Explicitly remove common Laravel cookie names as well
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
    } catch (err) {
      console.error('Error during logout/clearing cookies:', err);
    }
  }
}
