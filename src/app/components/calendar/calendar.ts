import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NgClass, NzCalendarModule, NzIconModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  constructor(private eventService: EventService) {}

  events = new Map<string, { type: string; title: string }[]>([
    ['2025-11-01', [
      { type: 'facebook', title: 'Gólyabál esemény' },
      { type: 'instagram', title: 'Quizek' }
    ]],
    ['2025-11-03', [
      { type: 'other', title: 'Animaci plakát' }
    ]],
    ['2025-11-15', [
      { type: 'discord', title: 'Tanulmányi ösztöndíjak' }
    ]],
    ['2025-11-10', [
      { type: 'webpage', title: 'Referensi pályázatok' }
    ]]
  ]);

  selectEvent(event: any) {
    this.eventService.selectEvent(event);
  }
}
