import { Component, Input, OnInit } from '@angular/core';
import { AVATAR_DEFAULT_NUM, AVATAR_DEFAULT_PATH, AVATAR_FIELD_KEY } from '@constants';
import { UserService } from '@core/services';
import { UserVo } from '@interfaces/vo';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.less'],
})
export class UpdateAvatarComponent implements OnInit {
  @Input() currUser!: UserVo;
  isOkLoading: boolean = false;
  loading: boolean = false;
  avatarCandidates: string[] = [];
  newAvatarSrc: string = '';
  avatarApi: string = '/api/user/avatar';
  avatarFieldKey: string = AVATAR_FIELD_KEY;

  constructor(
    private modal: NzModalRef,
    private userService: UserService,
    private nzMessage: NzMessageService,
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < AVATAR_DEFAULT_NUM; ++i) {
      this.avatarCandidates.push(`${AVATAR_DEFAULT_PATH}/avatar-${i}.png`);
    }
    this.newAvatarSrc = this.currUser.avatarSrc;
  }

  selectAvatar(avatar: string): void {
    this.newAvatarSrc = avatar;
  }

  updateAvatar(): void {
    if (this.newAvatarSrc === this.currUser.avatarSrc) {
      this.nzMessage.create('info', '头像没有更改');
      this.modal.destroy();
    } else {
      this.isOkLoading = true;
      this.userService.updateAvatar({ avatarSrc: this.newAvatarSrc }).subscribe({
        next: () => {
          this.nzMessage.create('success', '头像更改成功');
          this.modal.destroy();
        },
        error: (msg) => {
          this.nzMessage.create('error', msg);
          this.isOkLoading = false;
        },
      });
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.nzMessage.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.nzMessage.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.newAvatarSrc = info.file.response.avatarSrc
        break;
      case 'error':
        this.nzMessage.error('Network error');
        this.loading = false;
        break;
    }
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
