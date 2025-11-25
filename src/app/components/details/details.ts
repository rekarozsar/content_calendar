import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class EventDetailsComponent {
  selectedEvent: any | null = null;

  constructor(private eventService: EventService) {
    this.eventService.selectedEvent$.subscribe(event => {
      this.selectedEvent = event;
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
  }
}

}
