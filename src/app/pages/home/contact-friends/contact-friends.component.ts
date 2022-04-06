import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FriendStatus } from '@constants';
import { FriendSmVo } from '@interfaces/vo';
import { ChatService } from '../services';

@Component({
  selector: 'app-contact-friends',
  templateUrl: './contact-friends.component.html',
  styleUrls: ['./contact-friends.component.less'],
})
export class ContactFriendsComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();

  acceptedFriends$!: Observable<FriendSmVo[]>;
  hasNew: boolean = false;
  currFriendId: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.friends$.pipe(takeUntil(this._notifier)).subscribe((friends) => {
      const friend = friends.find(
        (friend) => friend.friendStatus === FriendStatus.REQUESTED && friend.isRequester,
      );
      this.hasNew = friend ? true : false;
    });

    this.chatService.currFriendId$
      .pipe(takeUntil(this._notifier))
      .subscribe((currFriendId) => (this.currFriendId = currFriendId));

    this.acceptedFriends$ = this.chatService.acceptedFriends$;
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  setCurrFriendId(friendId: string): void {
    this.chatService.setCurrentFriendId(friendId);
  }
}
