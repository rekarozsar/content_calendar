import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';
import { NzIconModule,  NzIconService } from 'ng-zorro-antd/icon';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';


@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, NzButtonModule, NzInputModule, NzFormModule, NzCheckboxModule, NzIconModule   ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private iconService: NzIconService) {
    this.iconService.addIcon(UserOutline, LockOutline);
    this.loginForm = fb.group({
      username: fb.control('admin@example.com', [Validators.required]),
      password: fb.control('password', [Validators.required, Validators.minLength(6)]),
      remember: [false]
    });
  }

  

  
  
  async submitForm() {

    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { username, password } = this.loginForm.value;

    try {
      // 1️⃣ Get CSRF cookie
      await firstValueFrom(this.auth.getCsrfCookie());

      // 2️⃣ Login
      await firstValueFrom(this.auth.login(username, password));

      // 3️⃣ Redirect
      await this.router.navigate(['/main']);
    } catch (err) {
      console.error('Login failed', err);
      this.error = 'Invalid credentials';
    } finally {
      this.loading = false;
    }

    

    

    /*
    this.auth.login(credentials).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
    */

    
  }


  /*
  submitForm(): void {
    console.log('submit');
    this.router.navigate(['/main']);
  }
    */
}
