import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  // modals
  isEditModalVisible = false;
  isPasswordModalVisible = false;

  // forms
  editForm = {
    name: '',
    email: ''
  };

  passwordForm = {
    old_password: '',
    new_password: ''
  };

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    this.user = await firstValueFrom(this.auth.getUser());
  }

  /* ---------- EDIT PROFILE ---------- */

  openEdit() {
    this.editForm = {
      name: this.user.name,
      email: this.user.email
    };
    this.isEditModalVisible = true;
  }

  cancelEdit() {
    this.isEditModalVisible = false;
  }

  saveEdit() {
    this.api.updateUser(this.user.id, this.editForm).subscribe({
      next: async () => {
        this.isEditModalVisible = false;
        await this.loadUser();
      },
      error: () => alert('Failed to update profile')
    });
  }

  /* ---------- CHANGE PASSWORD ---------- */

  openChangePassword() {
    this.passwordForm = {
      old_password: '',
      new_password: ''
    };
    this.isPasswordModalVisible = true;
  }

  cancelChangePassword() {
    this.isPasswordModalVisible = false;
  }

  changePassword() {
    this.api.updateUser(this.user.id, this.passwordForm).subscribe({
      next: () => {
        this.isPasswordModalVisible = false;
        alert('Password updated');
      },
      error: () => alert('Wrong password or error')
    });
  }
}
