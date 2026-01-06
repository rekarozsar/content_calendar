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

}
