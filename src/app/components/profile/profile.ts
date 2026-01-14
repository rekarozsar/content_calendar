import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    try {
      this.user = await firstValueFrom(this.auth.getUser());
    } catch {
      this.user = null;
    }
  }

  onEdit() {
    console.log('Edit profile clicked');
    // later: open modal / inline edit
  }

  onChangePassword() {
    console.log('Change password clicked');
    // later: navigate or open modal
  }
}
