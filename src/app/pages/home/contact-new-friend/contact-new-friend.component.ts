import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '@core/services';
import { AcceptFriendDto, DeclineFriendDto, RequestFriendDto } from '@interfaces/dto';
import { UserVo, FriendVo } from '@interfaces/vo';
import { FriendStatus } from '@constants';
import { ChatService, SocketService } from '../services';

@Component({
  selector: 'app-contact-new-friend',
  templateUrl: './contact-new-friend.component.html',
  styleUrls: ['./contact-new-friend.component.less'],
})
export class ContactNewFriendComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  private _searchedUser = new Subject<UserVo>();

  requestedFriends$!: Observable<FriendVo[]>;
  isReqLoading: boolean = false;
  searchedUser?: UserVo;
  searchStatus: string = '';
  currUser!: UserVo;

  searchName: string = '';

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.requestedFriends$ = this.chatService.friends$.pipe(
      map((friends) =>
        friends.filter(
          (friend) => friend.friendStatus === FriendStatus.REQUESTED && friend.isRequester,
        ),
      ),
    );

    this.userService.currUser$
      .pipe(takeUntil(this._notifier))
      .subscribe((user) => (this.currUser = user));

    combineLatest([this.chatService.friends$, this._searchedUser])
      .pipe(
        map(([friends, searchedUser]) => {
          if (!searchedUser) {
            this.searchStatus = '';
          } else if (searchedUser.id === this.currUser.id) {
            this.searchStatus = '本人';
          } else {
            const friend = friends.find((friend) => friend.user.id === searchedUser.id);
            if (friend) {
              if (friend.friendStatus === FriendStatus.ACCEPTED) {
                this.searchStatus = '已添加';
              } else if (friend.isRequester) {
                this.searchStatus = '待确认';
              } else {
                this.searchStatus = '等待对方确认';
              }
            } else {
              this.searchStatus = '';
            }
          }
          this.isReqLoading = false;
        }),
        takeUntil(this._notifier),
      )
      .subscribe();

    this._searchedUser
      .pipe(takeUntil(this._notifier))
      .subscribe((user) => (this.searchedUser = user));
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  onSearchUser(): void {
    if (this.searchName && this.searchName !== this.searchedUser?.username) {
      this.userService
        .searchUser({ username: this.searchName })
        .subscribe((user) => this._searchedUser.next(user));
    }
  }

  onRequestFriend(addresseeId: string): void {
    const param: RequestFriendDto = { addresseeId };
    this.socketService.emit('requestFriend', param);
    this.isReqLoading = true;
  }

  onAcceptFriend(friendshipId: string): void {
    const param: AcceptFriendDto = { friendshipId };
    this.socketService.emit('acceptFriend', param);
  }

  onDeclineFriend(friendshipId: string): void {
    const declineFriendDto: DeclineFriendDto = { friendshipId };
    this.socketService.emit('declineFriend', declineFriendDto);
  }
}
