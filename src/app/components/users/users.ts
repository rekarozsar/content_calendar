import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    NzButtonModule, 
    NzCardModule,
    NzModalModule,
    NzInputModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  isModalVisible = false;
  isEditMode = false;

  formUser: any = {
    id: null,
    name: '',
    email: ''
  };

  constructor(private api: ApiService, private modal: NzModalService, private auth: AuthService,) {}
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

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openNewUser() {
    this.isEditMode = false;
    this.formUser = {
      id: null,
      name: '',
      email: ''
    };
    this.isModalVisible = true;
  }

  openEditUser(user: any) {
    this.isEditMode = true;
    this.formUser = { ...user };
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleOk() {
    if (!this.formUser.name || !this.formUser.email) return;

    if (this.isEditMode) {
      this.api.updateUser(this.formUser.id, {
        name: this.formUser.name,
        email: this.formUser.email
      }).subscribe(() => {
        this.isModalVisible = false;
        this.loadUsers();
      });
    } else {
      this.api.createUser({
        name: this.formUser.name,
        email: this.formUser.email,
        password: 'password'
      }).subscribe(() => {
        this.isModalVisible = false;
        this.loadUsers();
      });
    }
  }

  async confirmDelete(user: any) {
    await this.fetchUser();
    if (user.id === this.user?.id) {
      this.modal.warning({
        nzTitle: 'Action not allowed',
        nzContent: 'You cannot delete your own account.'
      });
      return;
    }
    this.modal.confirm({
      nzTitle: 'Delete user',
      nzContent: `Are you sure you want to delete <b>${user.name}</b>?`,
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        return this.api.deleteUser(user.id).toPromise().then(() => {
          this.loadUsers();
        });
      }
    });
  }

  toggleAdmin(user: any) {
    if (user.admin) {
      // Revoke admin
      this.api.revokeAdminRights(user.id).subscribe({
        next: () => {
          user.admin = false; // update UI immediately
        },
        error: (err) => {
          console.error('Failed to revoke admin', err);
        }
      });
    } else {
      // Grant admin
      this.api.grantAdminRights(user.id).subscribe({
        next: () => {
          user.admin = true; // update UI immediately
        },
        error: (err) => {
          console.error('Failed to grant admin', err);
        }
      });
    }
  }




}
