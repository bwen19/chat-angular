import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateRoomDto } from '@interfaces/dto';
import { FriendSmVo } from '@interfaces/vo';
import { ChatService, SocketService } from '../services';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.less'],
})
export class CreateRoomComponent implements OnInit {
  validateForm!: FormGroup;
  list: TransferItem[] = [];
  modal?: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private nzMessage: NzMessageService,
    private chatService: ChatService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      roomName: [null, [Validators.required]],
    });
  }

  private initList(): void {
    this.chatService.acceptedFriends$.pipe(take(1)).subscribe((friends) => {
      friends.forEach((friend: FriendSmVo, index: number) => {
        this.list.push({
          key: (index + 1).toString(),
          title: friend.name,
          userId: friend.userId,
          avatarSrc: friend.avatarSrc,
        });
      });
    });
  }

  createModal(tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.initList();
    this.modal = this.modalService.create({
      nzTitle: '创建房间',
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzStyle: { top: '50px' },
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '450px',
    });
  }

  createRoom(): void {
    const userIds = this.list
      .filter((item) => item.direction === 'right')
      .map((item) => item['userId']);
    if (userIds.length < 2) {
      this.nzMessage.create('error', '新房间总人数不能小于3');
      return;
    }
    if (this.validateForm.valid) {
      const createRoomDto: CreateRoomDto = {
        name: this.validateForm.controls['roomName'].value,
        memberIds: userIds,
      };
      this.socketService.emit('createRoom', createRoomDto);
      this.destroyModal();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  destroyModal(): void {
    this.modal?.destroy();
    this.validateForm.reset();
    this.list = [];
  }
}
