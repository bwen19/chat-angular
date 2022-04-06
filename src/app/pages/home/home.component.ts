import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from '@core/services';
import { ChatService, SocketService } from './services';
import { CustomReuseStrategy } from '@core/strategies';
import { UpdateAvatarComponent } from './modals/update-avatar/update-avatar.component';
import { UpdateNicknameComponent } from './modals/update-nickname/update-nickname.component';
import { UpdatePasswordComponent } from './modals/update-password/update-password.component';
import { MsgToClient, UserVo } from '@interfaces/vo';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [SocketService, ChatService],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  currUser!: UserVo;
  isOkLoading: boolean = false;

  constructor(
    private nzMessage: NzMessageService,
    private socketService: SocketService,
    private modalService: NzModalService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.socketService
      .listen<MsgToClient>('msgToClient')
      .pipe(takeUntil(this._notifier))
      .subscribe((msg) => this.nzMessage.create(msg.status, msg.message));

    this.socketService
      .listen<string>('exception')
      .pipe(takeUntil(this._notifier))
      .subscribe((err: any) => console.log(`error: ${err.message}`));

    this.socketService
      .listen<string>('unauthorized')
      .pipe(takeUntil(this._notifier))
      .subscribe((msg) => {
        this.nzMessage.error(msg);
        this.router.navigateByUrl('/passport/login');
      });

    this.userService.currUser$
      .pipe(takeUntil(this._notifier))
      .subscribe((user) => (this.currUser = user));
  }

  ngOnDestroy(): void {
    this._notifier.next('');
    CustomReuseStrategy.removeCache('home');
  }

  modifyNickname(): void {
    this.modalService.create({
      nzTitle: '修改昵称',
      nzMaskClosable: false,
      nzWidth: '360px',
      nzContent: UpdateNicknameComponent,
      nzComponentParams: {
        nickname: this.currUser.nickname,
      },
    });
  }

  modifyPassword(): void {
    this.modalService.create({
      nzTitle: '修改密码',
      nzContent: UpdatePasswordComponent,
      nzMaskClosable: false,
      nzWidth: '360px',
    });
  }

  modifyAvatar(): void {
    this.modalService.create({
      nzTitle: '修改头像',
      nzContent: UpdateAvatarComponent,
      nzMaskClosable: false,
      nzWidth: '400px',
      nzComponentParams: {
        currUser: this.currUser,
      },
    });
  }
}
