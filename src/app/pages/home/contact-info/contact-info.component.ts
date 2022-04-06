import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { FriendVo } from '@interfaces/vo/friend.vo';
import { FriendStatus } from '@constants';
import { ChatService, SocketService } from '../services';
import { RemoveFriendDto } from '@interfaces/dto';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.less'],
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  currFriend: FriendVo | null = null;
  currFriendId: string = '';

  constructor(
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.chatService.friends$, this.chatService.currFriendId$])
      .pipe(takeUntil(this._notifier))
      .subscribe(([friends, currFriendId]) => {
        const friend = friends.find(
          (friend) => friend.id === currFriendId && friend.friendStatus === FriendStatus.ACCEPTED,
        );
        this.currFriend = friend || null;
      });

    this.chatService.currFriendId$.pipe(takeUntil(this._notifier)).subscribe((currFriendId) => {
      this.currFriendId = currFriendId;
    });
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  onChatWith(): void {
    if (this.currFriend?.roomId) {
      this.chatService.setCurrentRoomId(this.currFriend.roomId);
      this.router.navigateByUrl('/home/chat');
    }
  }

  onRemoveFriend(): void {
    const param: RemoveFriendDto = { friendshipId: this.currFriendId };
    this.socketService.emit('removeFriend', param);
  }
}
