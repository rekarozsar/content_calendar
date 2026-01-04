import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class EventDetailsComponent {
  selectedEvent: any | null = null;

  constructor(private eventService: EventService, private api: ApiService, public auth: AuthService) {
    this.eventService.selectedEvent$.subscribe(event => {
      this.selectedEvent = event;
    });
  }
  


   async ngOnInit() {
    await this.fetchUser();
    console.log('AAAAAAAAAAAAAAAAAAA', this.auth);
    this.api.ping().subscribe({
      next: (res) => console.log('API OK:', res),
      error: (err) => console.error('API ERROR:', err)
    });
    this.api.base().subscribe({
      next: (res) => console.log('Base API Response:', res),
      error: (err) => console.error('Base API ERROR:', err)
    });
  }

  user: any = null;
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

  onEdit() {
    if (this.selectedEvent) {
      console.log('Edit event:', this.selectedEvent);
      // TODO: edit functionality
    }
  }

  onDelete() {
    if (this.selectedEvent) {
      console.log('Delete event:', this.selectedEvent);
      // TODO: delete functionality
    }
  }

  onPosted() {
  if (this.selectedEvent) {
    this.selectedEvent.posted = !this.selectedEvent.posted; 
    this.eventService.updateSelectedEvent(this.selectedEvent);
    console.log('AAAAAAAAAAAAAAAAAAA', this.auth.getUser());
  }
}

}
