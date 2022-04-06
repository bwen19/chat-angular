import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '@core/services';
import { CreateUserDto } from '@interfaces/dto';
import { UserVo } from '@interfaces/vo';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent implements OnInit {
  users: UserVo[] = [];
  total = 1;
  loading = true;
  pageSize = 5;
  pageIndex = 1;
  isOkLoading = false;

  constructor(
    private userService: UserService,
    private nzMessage: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }

  loadDataFromServer(pageIndex: number, pageSize: number): void {
    this.loading = true;
    this.userService.getUserList({ pageIndex, pageSize }).subscribe({
      next: (data) => {
        this.loading = false;
        this.users = data.users;
        this.total = data.counts;
      },
      error: (msg) => {
        this.nzMessage.create('error', msg);
      },
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }

  showAddModal(content: TemplateRef<{}>, footer: TemplateRef<{}>): void {
    this.modal.create({
      nzTitle: '添加用户',
      nzContent: content,
      nzFooter: footer,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '360px',
      nzComponentParams: {
        createUserForm: this.fb.group({
          username: [null, [Validators.required]],
          password: [null],
        }),
      },
    });
  }

  addUser(createUserForm: FormGroup, mdoalRef: NzModalRef): void {
    if (createUserForm.valid) {
      this.isOkLoading = true;
      const formValue = createUserForm.value;
      const user: CreateUserDto = {
        username: formValue!.username,
        password: '123456'
      };
      if (formValue.password) {
        user['password'] = formValue.password;
      }

      this.userService.createUser(user).subscribe({
        next: () => {
          this.isOkLoading = false;
          this.loadDataFromServer(this.pageIndex, this.pageSize);
          mdoalRef.destroy();
        },
        error: (msg) => {
          this.isOkLoading = false;
          this.nzMessage.create('error', msg);
        },
      });
    } else {
      Object.values(createUserForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        if (this.users.length === 1 && this.pageIndex > 1) {
          this.pageIndex -= 1;
        }
        this.loadDataFromServer(this.pageIndex, this.pageSize);
      },
      error: (msg) => {
        this.nzMessage.create('error', msg);
      },
    });
  }
}
