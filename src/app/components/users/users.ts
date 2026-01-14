import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';


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

  constructor(private api: ApiService) {}

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


}
