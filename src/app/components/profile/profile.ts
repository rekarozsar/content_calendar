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
  formSubmitted = false;

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
    this.formSubmitted = false;
    this.isEditModalVisible = true;
  }

  cancelEdit() {
    this.isEditModalVisible = false;
  }

  saveEdit() {
    this.formSubmitted = true;

    if (!this.editForm.name || !this.editForm.email || !this.isEmailValid(this.editForm.email)) {
      return;
    }

    this.api.updateUser(this.user.id, this.editForm).subscribe({
      next: async () => {
        this.isEditModalVisible = false;
        await this.loadUser();
        this.formSubmitted = false;
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
    this.formSubmitted = true;

    if (!this.passwordForm.old_password || !this.passwordForm.new_password) {
      return;
    }

    const payload = {
      name: this.user.name,
      email: this.user.email,
      password: this.passwordForm.new_password
    };
    this.api.updateUser(this.user.id, payload).subscribe({
      next: () => {
        this.isPasswordModalVisible = false;
        alert('Password updated successfully');
        this.formSubmitted = false;
      },
      error: () => alert('Error updating password')
    });
  }

  isEmailValid(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
    return pattern.test(email);
  }

  getEmailError() {
    if (!this.editForm.email) return 'Email is required';
    if (!this.isEmailValid(this.editForm.email)) return 'Email must be valid';
    return null;
  }

}
