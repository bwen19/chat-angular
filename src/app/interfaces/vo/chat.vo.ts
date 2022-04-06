import { MessageType, RoomType } from '@constants';
import { UserVo } from '.';

export interface MsgToClient {
  status: string;
  message: string;
}

export interface MessageVo {
  id: string;
  sender: UserVo;
  content: string;
  messageType: MessageType;
  sendTime: Date;
}

export interface RoomVo {
  id: string;
  createTime: Date;
  name: string;
  members: UserVo[];
  messages: MessageVo[];
  roomType: RoomType;
  avatarSrc?: string;
  ownerId?: string;
  notice?: string;
  hasNew?: boolean;
}

export class RoomSmVo {
  readonly id: string;
  readonly name: string;
  readonly roomType: RoomType;
  readonly avatarSrc?: string;
  readonly lastMessage?: MessageVo;
  readonly hasNew: boolean;
  readonly className: string;
  readonly icon: string;

  constructor(room: RoomVo) {
    this.id = room.id;
    this.name = room.name;
    this.roomType = room.roomType;
    this.avatarSrc = room.avatarSrc;
    this.hasNew = room.hasNew || false;
    const length = room.messages.length;
    if (length > 0) {
      this.lastMessage = room.messages[length - 1];
    }
    if (room.roomType === RoomType.SINGLE) {
      this.className = 'avatar-single';
      this.icon = 'android';
    } else if (room.roomType === RoomType.FRIEND) {
      this.className = 'avatar-friend';
      this.icon = 'user';
    } else {
      this.className = 'avatar-public';
      this.icon = 'team';
    }
  }
}

export interface RoomsAddMessageVo {
  ev: 'addMessage';
  roomId: string;
  message: MessageVo;
}

export interface RoomsRemoveMessageVo {
  ev: 'removeMessage';
  roomId: string;
  messageId: string;
}

export interface RoomsAddRoomVo {
  ev: 'addRoom';
  room: RoomVo;
}

export interface RoomsRemoveRoomVo {
  ev: 'removeRoom';
  roomId: string;
}

export interface RoomsAddMembersVo {
  ev: 'addMembers';
  roomId: string;
  members: UserVo[];
}

export interface RoomsRemoveMembersVo {
  ev: 'removeMembers';
  roomId: string;
  memberIds: string[];
}

export interface RoomsUpdateNameVo {
  ev: 'updateName';
  roomId: string;
  name: string;
}

export interface RoomsUpdateNoticeVo {
  ev: 'updateNotice';
  roomId: string;
  notice: string;
}

export type RoomOperation =
  | RoomsAddMessageVo
  | RoomsRemoveMessageVo
  | RoomsAddRoomVo
  | RoomsRemoveRoomVo
  | RoomsAddMembersVo
  | RoomsRemoveMembersVo
  | RoomsUpdateNameVo
  | RoomsUpdateNoticeVo;
