import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '@core/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-nickname',
  templateUrl: './update-nickname.component.html',
})
export class UpdateNicknameComponent implements OnInit {
  @Input() nickname?: string;
  validateForm!: FormGroup;
  isOkLoading: boolean = false;

  nicknameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true, error: true };
    } else if (control.value === this.nickname) {
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
      nickname: [null, [this.nicknameValidator]],
    });
  }

  updateNickname(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true;
      this.userService
        .updateNickname({ nickname: this.validateForm.controls['nickname'].value })
        .subscribe({
          next: () => {
            this.nzMessage.create('success', '修改昵称成功');
            this.modal.destroy();
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
