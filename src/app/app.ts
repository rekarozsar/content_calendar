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
import { registerLocaleData } from '@angular/common';
import hu from '@angular/common/locales/hu';

import { CalendarComponent } from './components/calendar/calendar';
import { EventDetailsComponent } from './components/details/details';

import { AuthService } from './services/auth';


registerLocaleData(hu);


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
            CommonModule,
            NzLayoutModule, 
            NzMenuModule,
            NzDropDownModule,
            NzIconModule,
            NzCalendarModule,
            NzCardModule, 
            CalendarComponent,
            EventDetailsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
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



/*
  events = new Map<string, string[]>([
    ['2025-11-01', ['Plan social media posts', 'Team meeting']],
    ['2025-11-03', ['Draft blog article']],
  ]); */


  constructor(private auth: AuthService) {}

  user: any = null;
 

  testLogin() {
    this.auth.login('asd@asd.asd', 'asdasdasd')
      .then(res => {
        console.log('Login result:', res);
        return this.auth.getUser();
      })
      .then(user => {
        this.user = user;
        console.log('Authenticated user:', user);
      })
      .catch(err => console.error('Login failed', err));
  }


  @ViewChild('dateCellTemplate', { static: true }) dateCellTemplate!: TemplateRef<any>;
}
