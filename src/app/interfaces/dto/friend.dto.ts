export interface RequestFriendDto {
  addresseeId?: string;
  roomId?: string;
}

export interface AcceptFriendDto {
  friendshipId: string;
}
export interface DeclineFriendDto extends AcceptFriendDto {}

export interface RemoveFriendDto {
  friendshipId?: string;
  roomId?: string;
}
