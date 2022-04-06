import { MessageType } from '@constants';

// For messages
export interface SendMessageDto {
  content: string;
  messageType?: MessageType;
  roomId: string;
}

export interface RemoveMessageDto {
  messageId: string;
}

// For rooms
export interface CreateRoomDto {
  name: string;
  memberIds: string[];
}

export interface RemoveRoomDto {
  roomId: string;
}

export interface AddRoomMembersDto {
  roomId: string;
  memberIds: string[];
}

export interface DeleteRoomMembersDto extends AddRoomMembersDto {}

export interface LeaveRoomDto extends RemoveRoomDto {}

export interface UpdateRoomNameDto {
  roomId: string;
  name: string;
}

export interface UpdateRoomNoticeDto {
  roomId: string;
  notice: string;
}
