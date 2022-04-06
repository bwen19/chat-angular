import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '@core/services';
import { UserRegisterDto } from '@interfaces/dto';
import { UserVo } from '@interfaces/vo';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private nzMessage: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      passwordRepeat: [null, [Validators.required, this.confirmationValidator]],
      invitationCode: [null, [Validators.required]],
    });
  }

  get username(): AbstractControl {
    return this.validateForm.get('username')!;
  }
  get password(): AbstractControl {
    return this.validateForm.get('password')!;
  }
  get passwordRepeat(): AbstractControl {
    return this.validateForm.get('passwordRepeat')!;
  }
  get invitationCode(): AbstractControl {
    return this.validateForm.get('invitationCode')!;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const userRegisterDto: UserRegisterDto = {
        username: this.username.value,
        password: this.password.value,
        passwordRepeat: this.passwordRepeat.value,
        invitationCode: this.invitationCode.value,
      };
      this.authService.register(userRegisterDto).subscribe({
        next: (user: UserVo) => {
          this.nzMessage.create('success', `恭喜注册成功，${user.username}`);
          this.router.navigateByUrl('/passport/login');
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

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.passwordRepeat.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
