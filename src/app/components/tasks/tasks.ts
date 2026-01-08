import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tasks',
  imports: [
    
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  constructor(private auth: AuthService) {}
  user: any = null;

  async fetchUser() {
    try {
      const user = await firstValueFrom(this.auth.getUser());
      this.user = user;
      console.log('Fetched user:', user);
      return user;
    } catch (err) {
      console.warn('Could not fetch user (not authenticated or error):', err);
      this.user = null;
      return null;
    }
  }

  async ngOnInit() {
    await this.fetchUser();
  }
}
