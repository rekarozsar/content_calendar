import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzCheckboxModule
  ],
  templateUrl: './create-event.html',
    styleUrls: ['./create-event.css']
})
export class CreateEventComponent {
  isVisible = false;

  isEditMode = false;

  constructor(private eventService: EventService) {
  this.eventService.modalEvent$.subscribe(event => {
    if (event === null) {
      // CREATE
      this.isEditMode = false;
      this.resetForm();
    } else {
      // EDIT
      this.isEditMode = true;
      this.newEvent = {
        type: '',
        title: event.title ?? '',
        description: event.description ?? '',
        caption: event.caption ?? '',
        link: event.link ?? '',
        place: event.location ?? '',
        date: event.due_date ?? '',

        // ✅ DATE: string → Date
        post_by: event.post_by ? new Date(event.post_by) : null,

        // ✅ CHECKBOXES: map backend → frontend
        fb_post: !!event.facebook_post,
        fb_event: !!event.facebook_event,
        ig_post: !!event.instagram_post,
        ig_story: !!event.story,
        discord_post: !!event.tiktok,

        other_media: event.other_media ?? '',

        photo: '',
        graphics_maker_id: event.graphics_maker_id ?? null,
        text_writer_id: event.text_writer_id ?? null,
        posted: event.posted ?? false,

        // keep the id for update
        id: event.id
      };

    }

    this.isVisible = true;
  });
}

  @Output() eventCreated = new EventEmitter<any>();

  newEvent = {
    type: '',
    fb_post: false,
    ig_post: false,
    discord_post: false,
    fb_event: false,
    ig_story: false,
    other_media: '',
    title: '',
    post_by: null as Date | null, 
    date: '',
    place: '',
    description: '', 
    caption: '',
    link: '',
    photo: '',
    graphics_maker_id: null,
    text_writer_id: null,
    posted: false,
    id: null as number | null
  };

  show() {
    this.isVisible = true;
  }

  handleOk() {
    this.eventCreated.emit({
      ...this.newEvent,
      isEditMode: this.isEditMode
    });

    this.isVisible = false;
    this.resetForm();
  }


  handleCancel() {
    this.isVisible = false;
  }

  resetForm() {
  this.newEvent = {
    type: '',
    fb_post: false,
    ig_post: false,
    discord_post: false,
    fb_event: false,
    ig_story: false,
    other_media: '',
    title: '',
    post_by: null,
    date: '',
    place: '',
    description: '',
    caption: '',
    link: '',
    photo: '',
    graphics_maker_id: null,
    text_writer_id: null,
    posted: false,
    id: null as number | null
  };
}

}
