import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { combineLatest, combineLatestWith, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { FriendSmVo, RoomVo, UserVo } from '@interfaces/vo';
import { RoomType } from '@constants';
import { ChatService, SocketService } from '../services';
import {
  AddRoomMembersDto,
  DeleteRoomMembersDto,
  RequestFriendDto,
  UpdateRoomNameDto,
  UpdateRoomNoticeDto,
} from '@interfaces/dto';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from '@core/services';

@Component({
  selector: 'app-chat-room-detail',
  templateUrl: './chat-room-detail.component.html',
  styleUrls: ['./chat-room-detail.component.less'],
})
export class ChatRoomDetailComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  @Input() currRoom$!: Observable<RoomVo | null>;
  members$!: Observable<UserVo[]>;
  roomId: string = '';
  roomName: string = '';
  roomType?: RoomType;
  memberNum: number = 0;
  notice: string = '';
  isOwner: boolean = false;
  disableAddFriend: boolean = true;

  list: TransferItem[] = [];
  titles: string[] = [];

  constructor(
    private socketService: SocketService,
    private modalService: NzModalService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.members$ = this.currRoom$.pipe(
      combineLatestWith(this.userService.currUser$),
      map(([roomVo, currUser]) => {
        if (roomVo) {
          for (let member of roomVo.members) {
            if (member.id === currUser.id) {
              member.nickname = '我';
            }
          }
          return roomVo.members;
        } else {
          return [];
        }
      }),
    );

    this.currRoom$
      .pipe(combineLatestWith(this.userService.currUser$), takeUntil(this._notifier))
      .subscribe(([roomVo, currUser]) => {
        this.roomId = roomVo?.id || '';
        this.roomType = roomVo?.roomType;
        this.roomName = roomVo?.name || '';
        this.memberNum = roomVo?.members.length || 0;
        this.notice = roomVo?.notice || '';
        this.isOwner = currUser.id === roomVo?.ownerId;
      });

    combineLatest([this.chatService.friends$, this.currRoom$])
      .pipe(takeUntil(this._notifier))
      .subscribe(([friends, currRoom]) => {
        const friend = friends.find((friend) => friend.roomId === currRoom?.id);
        this.disableAddFriend = Boolean(friend);
      });
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  onRequestFriendFromRoom(): void {
    if (this.roomId) {
      const param: RequestFriendDto = { roomId: this.roomId };
      this.socketService.emit('requestFriend', param);
    }
  }

  onRemoveFriendFromRoom(): void {
    if (this.roomId) {
      this.socketService.emit('removeFriend', { roomId: this.roomId });
    }
  }

  onUpdateRoomName(): void {
    if (this.roomName) {
      const param: UpdateRoomNameDto = { roomId: this.roomId, name: this.roomName };
      this.socketService.emit('updateRoomName', param);
    }
  }

  onUpdateRoomNotice(): void {
    if (this.notice) {
      const param: UpdateRoomNoticeDto = { roomId: this.roomId, notice: this.notice };
      this.socketService.emit('updateRoomNotice', param);
    }
  }

  onRemoveRoom(): void {
    if (this.roomId) {
      this.socketService.emit('removeRoom', { roomId: this.roomId });
    }
  }

  onLeaveRoom(): void {
    if (this.roomId) {
      this.socketService.emit('leaveRoom', { roomId: this.roomId });
    }
  }

  private addRoomMembers(): void {
    const memberIds: string[] = this.list
      .filter((item) => item.direction === 'right' && !item.disabled)
      .map((item) => item['userId']);
    if (this.roomId && memberIds) {
      const param: AddRoomMembersDto = { roomId: this.roomId, memberIds };
      this.socketService.emit('addRoomMembers', param);
    }
  }

  private deleteRoomMembers(): void {
    const memberIds: string[] = this.list
      .filter((item) => item.direction === 'left')
      .map((item) => item['userId']);
    if (this.roomId && memberIds) {
      const param: DeleteRoomMembersDto = { roomId: this.roomId, memberIds };
      this.socketService.emit('deleteRoomMembers', param);
    }
  }

  onAddRoomMembers(tplContent: TemplateRef<{}>): void {
    this.titles = ['好友', '房间成员'];
    this.list = [];
    combineLatest([this.members$, this.chatService.acceptedFriends$])
      .pipe(take(1))
      .subscribe(([members, friends]) => {
        const memberIds = members.map((member) => member.id);
        friends.forEach((friend: FriendSmVo) => {
          if (!memberIds.includes(friend.userId)) {
            this.list.push({
              title: friend.name,
              userId: friend.userId,
              avatarSrc: friend.avatarSrc,
            });
          }
        });
        members.forEach((member) => {
          this.list.push({
            title: member.nickname,
            userId: member.id,
            avatarSrc: member.avatarSrc,
            disabled: true,
            direction: 'right',
          });
        });
      });

    this.modalService.create({
      nzTitle: '添加成员',
      nzContent: tplContent,
      nzStyle: { top: '50px' },
      nzOnOk: () => this.addRoomMembers(),
      nzMaskClosable: false,
      nzWidth: '450px',
    });
  }

  onDeleteRoomMembers(tplContent: TemplateRef<{}>): void {
    this.titles = ['待移除', '房间成员'];
    this.list = [];
    this.members$.pipe(take(1)).subscribe((members) => {
      members.forEach((member) => {
        this.list.push({
          title: member.nickname,
          userId: member.id,
          avatarSrc: member.avatarSrc,
          direction: 'right',
          disabled: member.nickname === '我',
        });
      });
    });

    this.modalService.create({
      nzTitle: '删除成员',
      nzContent: tplContent,
      nzStyle: { top: '50px' },
      nzOnOk: () => this.deleteRoomMembers(),
      nzMaskClosable: false,
      nzWidth: '450px',
    });
  }
}
