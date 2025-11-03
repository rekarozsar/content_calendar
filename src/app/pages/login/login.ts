import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, NzButtonModule, NzInputModule, NzFormModule, NzCheckboxModule ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      username: fb.control('demo@gmail.com', [Validators.required, Validators.email]),
      password: fb.control('csao', [Validators.required, Validators.minLength(6)]),
      remember: [false]
    });
  }

  submitForm(): void {
    console.log('submit');
  }
}
