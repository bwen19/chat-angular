import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '@core/services';
import { UserLoginDto } from '@interfaces/dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private nzMessage: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.authService.clearAuth();
    const localUsername = localStorage.getItem('username');
    const localRemember = localStorage.getItem('remember') === 'true';
    this.validateForm = this.fb.group({
      username: [localUsername, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [localRemember],
    });
  }

  get username(): AbstractControl {
    return this.validateForm.get('username')!;
  }
  get password(): AbstractControl {
    return this.validateForm.get('password')!;
  }
  get remember(): AbstractControl {
    return this.validateForm.get('remember')!;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const userLoginDto: UserLoginDto = {
        username: this.username.value,
        password: this.password.value,
      };
      this.authService.login(userLoginDto).subscribe({
        next: () => {
          if (this.remember.value) {
            localStorage.setItem('remember', 'true');
            localStorage.setItem('username', this.username.value);
          } else {
            localStorage.removeItem('remember');
            localStorage.removeItem('username');
          }
        },
        error: (msg) => {
          this.nzMessage.create('error', msg);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
