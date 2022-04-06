import { FriendStatus } from '@constants';
import { UserVo } from '.';

export interface FriendVo {
  id: string;
  user: UserVo;
  friendStatus: FriendStatus;
  createTime: Date;
  roomId?: string;
  isRequester?: boolean;
}

export class FriendSmVo {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly avatarSrc: string;

  constructor(friend: FriendVo) {
    this.id = friend.id;
    this.userId = friend.user.id;
    this.name = friend.user.nickname;
    this.avatarSrc = friend.user.avatarSrc;
  }
}

export interface FriendsAddFriendVo {
  ev: 'addFriend';
  friend: FriendVo;
}

export interface FriendsUpdateFriendVo {
  ev: 'updateFriend';
  friendshipId: string;
  friendStatus: FriendStatus;
  roomId?: string;
}

export interface FriendsRemoveFriendVo {
  ev: 'removeFriend';
  friendshipId: string;
}

export type FriendOperation = FriendsAddFriendVo | FriendsUpdateFriendVo | FriendsRemoveFriendVo;
