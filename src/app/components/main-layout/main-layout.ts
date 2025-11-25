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


  constructor() {}

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
}
