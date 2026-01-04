import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api';
import { AuthService } from '../../services/auth';



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
  

   ngOnInit() {
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
    console.log('AAAAAAAAAAAAAAAAAAA', this.auth);
  }
}

}
