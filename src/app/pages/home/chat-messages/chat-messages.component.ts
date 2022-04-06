import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/services';
import { RequestFriendDto } from '@interfaces/dto';
import { MessageVo, UserVo } from '@interfaces/vo';
import { Subject, takeUntil } from 'rxjs';
import { ChatService, SocketService } from '../services';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.less'],
})
export class ChatMessagesComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  @Input() message!: MessageVo;

  sender!: UserVo;
  isSelf!: boolean;
  isFriend!: boolean;
  friendRoomId?: string;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.userService.currUser$.pipe(takeUntil(this._notifier)).subscribe((currUser) => {
      if (currUser.id === this.message.sender.id) {
        this.sender = currUser;
        this.isSelf = true;
      } else {
        this.sender = this.message.sender;
        this.isSelf = false;
      }
    });

    this.chatService.friends$.pipe(takeUntil(this._notifier)).subscribe((friends) => {
      const friend = friends.find((friend) => friend.user.id === this.message.sender.id);
      this.isFriend = Boolean(friend);
      this.friendRoomId = friend?.roomId;
    });
  }

  onClickButton(): void {
    if (this.isFriend) {
      this.chatService.setCurrentRoomId(this.friendRoomId!);
    } else {
      const param: RequestFriendDto = { addresseeId: this.sender.id };
      this.socketService.emit('requestFriend', param);
    }
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }
}
