import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, merge, Observable, scan, Subject, switchMap, takeUntil } from 'rxjs';
import { RoomVo, RoomOperation, FriendOperation, FriendVo, FriendSmVo } from '@interfaces/vo';
import { SocketService } from './socket.service';
import { FriendStatus, RoomType } from '@constants';

@Injectable()
export class ChatService {
  private _notifier = new Subject<string>();
  private _trigger = new BehaviorSubject<string>('');

  private _roomOp = new Subject<RoomOperation>();
  private _rooms = new BehaviorSubject<RoomVo[]>([]);
  private _currRoomId = new BehaviorSubject<string>('');

  private _friendOp = new Subject<FriendOperation>();
  private _friends = new BehaviorSubject<FriendVo[]>([]);
  private _currFriendId = new BehaviorSubject<string>('');

  rooms$ = this._rooms.asObservable();
  currRoomId$ = this._currRoomId.asObservable();

  friends$ = this._friends.asObservable();
  currFriendId$ = this._currFriendId.asObservable();
  acceptedFriends$!: Observable<FriendSmVo[]>;

  constructor(private socketService: SocketService, private http: HttpClient) {
    this.socketService
      .listen<RoomOperation>('room')
      .pipe(takeUntil(this._notifier))
      .subscribe(this._roomOp);

    this.socketService
      .listen<RoomVo[]>('initRooms')
      .pipe(
        switchMap((rooms: RoomVo[]) => {
          return merge(this._trigger, this._roomOp).pipe(
            scan((acc: RoomVo[], curr: string | RoomOperation) => {
              if (typeof curr !== 'string') {
                let index: number;
                switch (curr.ev) {
                  case 'addMessage':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      acc[index].hasNew = true;
                      acc[index].messages.push(curr.message);
                    }
                    break;
                  case 'removeMessage':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      const index1 = acc[index].messages.findIndex(
                        (message) => message.id === curr.messageId,
                      );
                      if (index1 > -1) {
                        acc[index].messages.splice(index1, 1);
                      }
                    }
                    break;
                  case 'addRoom':
                    acc.push(curr.room);
                    break;
                  case 'removeRoom':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      acc.splice(index, 1);
                    }
                    break;
                  case 'addMembers':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      acc[index].members.push(...curr.members);
                      if (acc[index].roomType === RoomType.FRIEND) {
                        acc[index].avatarSrc = curr.members[0].avatarSrc;
                      }
                    }
                    break;
                  case 'removeMembers':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      const members = acc[index].members.filter(
                        (member) => !curr.memberIds.includes(member.id),
                      );
                      acc[index].members = members;
                    }
                    break;
                  case 'updateName':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      acc[index].name = curr.name;
                    }
                    break;
                  case 'updateNotice':
                    index = acc.findIndex((room) => room.id === curr.roomId);
                    if (index > -1) {
                      acc[index].notice = curr.notice;
                    }
                    break;
                  default:
                    const exhaustiveCheck: never = curr;
                    break;
                }
              }
              return acc;
            }, rooms),
          );
        }),
        takeUntil(this._notifier),
      )
      .subscribe(this._rooms);

    this.socketService
      .listen<FriendOperation>('friend')
      .pipe(takeUntil(this._notifier))
      .subscribe(this._friendOp);

    this.http
      .get<FriendVo[]>('/api/friend/mine')
      .pipe(
        switchMap((friends: FriendVo[]) => {
          return merge(this._trigger, this._friendOp).pipe(
            scan((acc: FriendVo[], curr: string | FriendOperation) => {
              if (typeof curr !== 'string') {
                let index: number;
                switch (curr.ev) {
                  case 'addFriend':
                    acc.push(curr.friend);
                    break;
                  case 'updateFriend':
                    index = acc.findIndex((friend) => friend.id === curr.friendshipId);
                    if (index > -1) {
                      acc[index].friendStatus = curr.friendStatus;
                      if (curr.roomId) {
                        acc[index].roomId = curr.roomId;
                      }
                    }
                    break;
                  case 'removeFriend':
                    index = acc.findIndex((friend) => friend.id === curr.friendshipId);
                    if (index > -1) {
                      acc.splice(index, 1);
                    }
                    break;
                  default:
                    const exhaustiveCheck: never = curr;
                    break;
                }
              }
              return acc;
            }, friends),
          );
        }),
        takeUntil(this._notifier),
      )
      .subscribe(this._friends);

    this.acceptedFriends$ = this._friends.pipe(
      map((friends) => {
        return friends
          .filter((friend) => friend.friendStatus === FriendStatus.ACCEPTED)
          .map((friend) => new FriendSmVo(friend))
          .sort((a: FriendSmVo, b: FriendSmVo) => {
            return a.name.localeCompare(b.name);
          });
      }),
      takeUntil(this._notifier),
    );

    this.socketService.connectSocket();
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  setCurrentRoomId(roomId: string): void {
    this._currRoomId.next(roomId);
  }

  setCurrentFriendId(friendId: string): void {
    this._currFriendId.next(friendId);
  }
}
