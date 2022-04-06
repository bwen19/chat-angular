import { UserRole } from '@constants';

export interface UserVo {
  id: string;
  username: string;
  nickname: string;
  userRole: UserRole;
  avatarSrc: string;
  createTime: Date;
}

export interface UserListVo {
  users: UserVo[];
  counts: number;
}

export interface AuthVo {
  user: UserVo;
  accessToken: string;
}
