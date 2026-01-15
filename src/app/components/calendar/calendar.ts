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
    this.eventService.refresh$.subscribe(() => {
      this.refreshTasks();
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
      const fullyDone = task.graphics_done && task.text_done;



      map.get(dateStr)!.push({
        id: task.id,
        type,
        facebook_post: task.facebook_post,
        facebook_event: task.facebook_event,
        instagram_post: task.instagram_post,
        story: task.story,
        discord_post: task.tiktok,
        other_media: task.other_media ?? null,
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
        posted: task.poster ?? false,
        post_by: task.post_by,
        fullyDone
      });
    }

    this.events = map;
  }

  toDateKey(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }



  userMap = new Map<number, string>();

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: users => {
        this.userMap = new Map(users.map(u => [u.id, u.name]));

        this.api.getTasks().subscribe({
          next: tasks => {
            console.log('FIRST TASK ONLY:', tasks[0]);
            this.buildCalendarEvents(tasks, this.userMap);
          },
          error: err => console.error('ERROR fetching tasks:', err)
        });
      },
      error: err => console.error('ERROR fetching users:', err)
    });
  }

  
  

  refreshTasks() {
    this.api.getTasks().subscribe({
      next: tasks => {
        this.buildCalendarEvents(tasks, this.userMap);
        console.log('Calendar refreshed');
      },
      error: err => console.error('ERROR refreshing tasks:', err)
    });
  }








  
  events = new Map<string, { // post_by
                             id: number,
                             type: string; //fb...
                             facebook_post: boolean,
                             facebook_event: boolean,
                             instagram_post: boolean,
                             story: boolean,
                             discord_post: boolean,
                             other_media: string | null,
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
                             posted: boolean, // poster ???
                             post_by: Date | null, // post_by
                             fullyDone: boolean
                            }[]>
                            
  selectEvent(event: any) {
    this.eventService.selectEvent(event);
    this.eventService.requestOpenDetails();
  }
}
