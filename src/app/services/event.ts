import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private selectedEventSource = new BehaviorSubject<any | null>(null);
  selectedEvent$ = this.selectedEventSource.asObservable();

  selectEvent(event: any) {
    this.selectedEventSource.next(event);
  }

  clearSelection() {
    this.selectedEventSource.next(null);
  }

  updateSelectedEvent(event: any) {
    this.selectedEventSource.next(event);
  }

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next();
  }

  private modalEventSource = new Subject<any>();
  modalEvent$ = this.modalEventSource.asObservable();

  openCreate() {
    this.modalEventSource.next(null);
  }

  openEdit(event: any) {
    this.modalEventSource.next({ ...event }); 
    console.log('EventService: openEdit called with event:', event);
  }

  private openDetailsSubject = new Subject<void>();
  openDetails$ = this.openDetailsSubject.asObservable();

  requestOpenDetails() {
    this.openDetailsSubject.next();
  }

}
