import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@core/services';
import { UpdatePasswordDto } from '@interfaces/dto';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
  validateForm!: FormGroup;
  isOkLoading: boolean = false;

  repeatValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true, error: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { repeat: true, error: true };
    } else {
      return {};
    }
  };

  constructor(
    private modal: NzModalRef,
    private userService: UserService,
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      passwordRepeat: [null, [this.repeatValidator]],
    });
  }

  updatePassword(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true;
      const param: UpdatePasswordDto = {
        oldPassword: this.validateForm.controls['oldPassword'].value,
        password: this.validateForm.controls['password'].value,
        passwordRepeat: this.validateForm.controls['passwordRepeat'].value,
      };
      this.userService.updatePassword(param).subscribe({
        next: () => {
          this.modal.destroy();
          this.nzMessage.create('success', '修改密码成功');
          this.isOkLoading = false;
        },
        error: (msg) => {
          this.nzMessage.create('error', msg);
          this.isOkLoading = false;
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

  destroyModal(): void {
    this.modal.destroy();
  }
}
