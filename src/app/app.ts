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

// cleaned

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

  @ViewChild('dateCellTemplate', { static: true }) dateCellTemplate!: TemplateRef<any>;
}
