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
      console.log('selectedEvent FROM SERVICE:', event);
    });
  }
  


   async ngOnInit() {
    await this.fetchUser();
    console.log('AAAAAAAAAAAAAAAAAAA', this.auth);
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
    if (!this.selectedEvent) return;

    this.eventService.openEdit(this.selectedEvent);
  }


  onDelete() {
  if (!this.selectedEvent) return;

  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  console.log('Deleting event:', this.selectedEvent);

  this.api.deleteTask(this.selectedEvent.id).subscribe({
    next: () => {
      console.log('Task deleted');

      this.eventService.updateSelectedEvent(null);

      this.eventService.triggerRefresh();
    },
    error: err => {
      console.error('DELETE failed:', err);
    }
  });
}

  

  onPosted() {
    if (this.selectedEvent) {
      this.selectedEvent.posted = !this.selectedEvent.posted; 
      this.eventService.updateSelectedEvent(this.selectedEvent);
      console.log('AAAAAAAAAAAAAAAAAAA', this.user);
    }
  }

  get isAdmin(): boolean {
    return !!this.user?.admin;
  }

  async signUp() {
    if (!this.selectedEvent || !this.user) return;

    const updatedTask: any = {};

    // Use the backend field names!
    if (this.selectedEvent.signUpGraphics && !this.selectedEvent.graphics_maker) {
      updatedTask.graphics_maker = this.user.id;
    }

    if (this.selectedEvent.signUpText && !this.selectedEvent.text_writer) {
      updatedTask.text_writer = this.user.id;
    }

    if (Object.keys(updatedTask).length === 0) {
      alert('Nothing to sign up for or already taken.');
      return;
    }

    console.log('Updating task with payload:', updatedTask);

    try {
      const updated = await firstValueFrom(this.api.updateTask(this.selectedEvent.id, updatedTask));
      console.log('API response:', updated);

      // Merge the updated fields locally
      this.selectedEvent = { ...this.selectedEvent, ...updated };
      this.eventService.updateSelectedEvent(this.selectedEvent);

      // Reset checkboxes
      this.selectedEvent.signUpGraphics = false;
      this.selectedEvent.signUpText = false;

      alert('Successfully signed up!');
      this.eventService.selectEvent(null); 

      this.eventService.triggerRefresh();
    } catch (err) {
      console.error('Failed to sign up:', err);
      alert('Sign up failed.');
    }
  }




}
