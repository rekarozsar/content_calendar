import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  templateUrl: './create-event.html',
    styleUrls: ['./create-event.css']
})
export class CreateEventComponent {
  isVisible = false;

  @Output() eventCreated = new EventEmitter<any>();

  newEvent = {
    type: '',
    title: '',
    post_date: null as Date | null, 
    date: '',
    place: '',
    description: '', 
    caption: '',
    link: '',
    photo: '',
    graphics_maker_id: null,
    text_writer_id: null,
    posted: false
  };

  show() {
    this.isVisible = true;
  }

  handleOk() {
    this.eventCreated.emit(this.newEvent);
    this.isVisible = false;

    // Reset
    this.newEvent = {
      type: '',
      title: '',
      post_date: null,
      date: '',
      place: '',
      description: '',
      caption: '',
      link: '',
      photo: '',
      graphics_maker_id: null,
      text_writer_id: null,
      posted: false
    };
  }

  handleCancel() {
    this.isVisible = false;
  }
}
