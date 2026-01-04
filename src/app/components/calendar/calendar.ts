import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { EventService } from '../../services/event';
import { FacebookOutline, InstagramOutline, CalendarOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NgClass, NzCalendarModule, NzIconModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {

  selectedEvent: any = null;

  constructor(private eventService: EventService, private iconService: NzIconService) {
    this.iconService.addIcon(FacebookOutline, InstagramOutline, CalendarOutline);
    this.eventService.selectedEvent$.subscribe(event => {
    this.selectedEvent = event;
  });
  }

  events = new Map<string, { type: string; title: string, 
                             description: string, date: Date | null,
                             place: string | null,
                             link: string | null, photo: string | null, 
                             graphics: string[] | null, text: string[] | null,
                             posted: boolean
                            }[]>([
    ['2026-01-03', [
      { type: 'facebook', title: 'Gólyabál esemény', 
        description: 'AAAAA AA AAAAA AAAAAAAAAA AAAAAAAA AAAAAAA AAAAAAAAA AAAAAAAA AAAAAAAAA AAAAAA AAAAA', date: new Date('2025-11-11:23:00'),
        place: 'Négyzet aula',
        link: null, photo: null, 
        graphics: null, text: ['Teszt Elek'],
        posted: false
      },
      { type: 'instagram', title: 'Quizek', 
        description: 'ijsd dsjidsd dusdljsd dpojdé djldj sduidsknd sdihsdksd oisdj lsd ildslj', date: null,
        place: null,
        link: null, photo: null,
        graphics: ['Virág', 'Emma', 'Zoltán', 'Andor'], text: null,
        posted: false
      }
    ]],
    ['2026-01-04', [
      { type: 'other', title: 'Animaci plakát', 
        description: 'yapp', date: null,
        place: null,
        link: null, photo: null,
        graphics: null, text: null,
        posted: false
      }
    ]],
    ['2026-01-15', [
      { type: 'discord', title: 'Tanulmányi ösztöndíjak', 
        description: 'uashask', date: null,
        place: null,
        link: null, photo: null,
        graphics: null, text: null,
        posted: false
      }
    ]],
    ['2026-01-10', [
      { type: 'webpage', title: 'Referensi pályázatok', 
        description: 'skxhnax', date: null,
        place: null,
        link: null, photo: null,
        graphics: null, text: null,
        posted: false
      }
    ]],
    ['2026-01-02', [
      { type: 'facebook', title: 'Séta',
        description: 'hkdhsidisn', date: null,
        place: null, photo: null,
        graphics: null, text: null,
        link: null ,
        posted: false
      }
    ]],
    ['2026-01-12', [
      { type: 'instagram', title: 'Séta',
        description: 'hkdhsidisn', date: null,
        place: null, photo: null,
        graphics: null, text: null,
        link: null ,
        posted: false
      },
      { type: 'instagram', title: 'Séta',
        description: 'hkdhsidisn', date: null,
        place: null, photo: null,
        graphics: null, text: null,
        link: null ,
        posted: false
      }
    ]],
      
  ]);

  selectEvent(event: any) {
    this.eventService.selectEvent(event);
  }
}
