import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuOutline } from '@ant-design/icons-angular/icons';
import { NzCalendarModule  } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
            CommonModule,
            NzLayoutModule, 
            NzMenuModule,
            NzDropDownModule,
            NzIconModule,
            NzCalendarModule,
            NzCardModule, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  icons = [ MenuOutline ]; 

  /*
   events = new Map<string, string[]>([
    ['2025-11-01', ['Plan social media posts', 'Team meeting']],
    ['2025-11-03', ['Draft blog article']],
  ]);

  dateCellRender(date: Date) {
    const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayEvents = this.events.get(key) || [];
    return dayEvents.map(event => `<div class="event">${event}</div>`).join('');
  }
  */

  events = new Map<string, string[]>([
    ['2025-11-01', ['Plan social media posts', 'Team meeting']],
    ['2025-11-03', ['Draft blog article']],
  ]);

  @ViewChild('dateCellTemplate', { static: true }) dateCellTemplate!: TemplateRef<any>;
}
