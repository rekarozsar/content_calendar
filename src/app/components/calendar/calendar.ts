import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { EventService } from '../../services/event';
import { FacebookOutline, InstagramOutline, CalendarOutline } from '@ant-design/icons-angular/icons';
import { ApiService } from '../../api';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NgClass, NzCalendarModule, NzIconModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {

  selectedEvent: any = null;

  constructor(private eventService: EventService, private iconService: NzIconService, private api: ApiService) {
    this.iconService.addIcon(FacebookOutline, InstagramOutline, CalendarOutline);
    this.eventService.selectedEvent$.subscribe(event => {
    this.selectedEvent = event;
  });
  }

  buildCalendarEvents(tasks: any[], userMap: Map<number, string>) {
    const map = new Map<string, any[]>();

    for (const task of tasks) {
      const dateStr = task.post_by ? this.toDateKey(task.post_by) : this.toDateKey(new Date());

      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }

      // Type
      let type = 'other';
      if ((task.facebook_post || task.facebook_event) && (task.instagram_post || task.story)) type = 'facebook_instagram';
      else if (task.facebook_post || task.facebook_event) type = 'facebook';
      else if (task.instagram_post || task.story) type = 'instagram';
      else if (task.tiktok) type = 'discord';

      // Graphics/text
      const graphics = userMap.get(task.graphics_maker) ?? null;
      const text = userMap.get(task.text_writer) ?? null;


      map.get(dateStr)!.push({
        type,
        facebook_post: task.facebook_post,
        facebook_event: task.facebook_event,
        instagram_post: task.instagram_post,
        story: task.story,
        discord_post: task.tiktok,
        title: task.title,
        description: task.description,
        date: task.due_date,
        place: task.location ?? null,
        link: null,
        caption: task.caption ?? null,
        photo: task.images && task.images.length > 0 ? task.images[0] : null,
        graphics_done: task.graphics_done,
        graphics,
        text_done: task.text_done,
        text,
        posted: false
      });
    }

    this.events = map;
  }

  toDateKey(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }



  ngOnInit() {
    this.api.getUsers().subscribe({
    next: users => {
      const userMap = new Map(users.map(u => [u.id, u.name]));

      // Then fetch tasks
      this.api.getTasks().subscribe({
        next: tasks => {
          console.log('FIRST TASK ONLY:', tasks[0]);
          this.buildCalendarEvents(tasks, userMap)},
        error: err => console.error('ERROR fetching tasks:', err)
      });
    },
    error: err => console.error('ERROR fetching users:', err)
  });
  }






  
  events = new Map<string, { // post_by
                             type: string; //fb...
                             facebook_post: boolean,
                             facebook_event: boolean,
                             instagram_post: boolean,
                             story: boolean,
                             discord_post: boolean,                             
                             // other media
                             title: string, // title
                             description: string, //same
                             //caption
                             date: string | null, //due date
                             place: string | null, //location
                             link: string | null, 
                             photo: string | null, // images
                             graphics: string | null, //grahics maker
                             graphics_done: boolean, // graphics done
                             text: string | null, // text_writer
                             text_done: boolean, // text done
                             posted: boolean // poster ???
                            

                            }[]>/*([
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
  */

  selectEvent(event: any) {
    this.eventService.selectEvent(event);
  }
}
