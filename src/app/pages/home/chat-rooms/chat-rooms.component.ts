import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { RoomType } from '@constants';
import { RoomSmVo } from '@interfaces/vo';
import { ChatService } from '../services';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.less'],
})
export class ChatRoomsComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  inputValue: string = '';

  orderedRooms$!: Observable<RoomSmVo[]>;
  currRoomId: string = '';

  iconMap: Map<RoomType, string> = new Map([
    [RoomType.PUBLIC, 'team'],
    [RoomType.SINGLE, 'android'],
  ]);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.orderedRooms$ = combineLatest([
      this.chatService.rooms$,
      this.chatService.currRoomId$,
    ]).pipe(
      map(([rooms, currRoomId]) => {
        const roomMs = rooms.map((room) => {
          if (room.id === currRoomId) {
            room.hasNew = false;
          }
          return new RoomSmVo(room);
        });
        return roomMs.sort((a: RoomSmVo, b: RoomSmVo) => {
          const ta = this.getTime(a.lastMessage?.sendTime);
          const tb = this.getTime(b.lastMessage?.sendTime);
          return tb - ta;
        });
      }),
    );
    this.chatService.currRoomId$
      .pipe(takeUntil(this._notifier))
      .subscribe((roomId) => (this.currRoomId = roomId));
  }

  private getTime(ctime?: Date | string): number {
    if (ctime instanceof Date) {
      return ctime.getTime();
    } else if (ctime) {
      return Date.parse(ctime);
    } else {
      return 0;
    }
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  setCurrRoomId(roomId: string): void {
    this.chatService.setCurrentRoomId(roomId);
  }
}
