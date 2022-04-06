import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { SendMessageDto } from '@interfaces/dto';
import { MessageVo, RoomVo, UserVo } from '@interfaces/vo';
import { ChatService, SocketService } from '../services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomType } from '@constants';
import { UserService } from '@core/services';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.less'],
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();
  private _currRoom = new BehaviorSubject<RoomVo | null>(null);

  currRoom$ = this._currRoom.asObservable();
  messages$!: Observable<MessageVo[]>;
  currUserId: string = '';
  currRoomId: string = '';
  currRoomName: string = '';

  messageContent = '';
  showDetail: boolean = false;
  canReceive: boolean = true;
  publicMemberNum: number = 0;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private userService: UserService,
    private nzMessage: NzMessageService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    combineLatest([this.chatService.rooms$, this.chatService.currRoomId$])
      .pipe(
        map(([rooms, currRoomId]) => rooms.find((room) => room.id === currRoomId) || null),
        takeUntil(this._notifier),
      )
      .subscribe(this._currRoom);

    this._currRoom.pipe(takeUntil(this._notifier)).subscribe((currRoom) => {
      if (currRoom) {
        this.currRoomId = currRoom.id;
        this.showDetail = false;
        this.currRoomName = currRoom.name;
        const memberNum = currRoom.members.length;
        this.publicMemberNum = currRoom.roomType === RoomType.PUBLIC ? memberNum : 0;
        if (memberNum < 2 && currRoom.roomType !== RoomType.SINGLE) {
          this.canReceive = false;
        } else {
          this.canReceive = true;
        }
      } else {
        this.currRoomId = '';
        this.currRoomName = '';
        this.showDetail = false;
        this.publicMemberNum = 0;
        this.canReceive = false;
      }
    });

    this.userService.currUser$
      .pipe(takeUntil(this._notifier))
      .subscribe((user: UserVo) => (this.currUserId = user.id));

    this.messages$ = this._currRoom.pipe(map((currRoom) => (currRoom && currRoom.messages) || []));

    this.messages$
      .pipe(takeUntil(this._notifier))
      .subscribe(() => setTimeout(() => this.scrollToBottom()));
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }

  private scrollToBottom(): void {
    try {
      const scrollBar = this.el.nativeElement.querySelector('.chat-messages-container');
      scrollBar.scrollTop = scrollBar.scrollHeight;
    } catch (err) {}
  }

  onShowChatBox(): void {
    this.showDetail = false;
    setTimeout(() => this.scrollToBottom());
  }

  onSendMessage(): void {
    if (this.currRoomId && this.messageContent) {
      const sendMessageDto: SendMessageDto = {
        content: this.messageContent,
        roomId: this.currRoomId,
      };
      this.socketService.emit<SendMessageDto>('sendMessage', sendMessageDto);
      this.messageContent = '';
    }
    if (!this.canReceive) {
      this.nzMessage.create('error', '消息已发出, 但对方无法收到！');
    }
  }
}
