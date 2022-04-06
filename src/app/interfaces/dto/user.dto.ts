import { UserRole } from '@constants';
import { PageOptionsDto } from '.';

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface UserRegisterDto extends UserLoginDto {
  passwordRepeat: string;
  invitationCode: string;
}

export interface UpdatePasswordDto {
  password: string;
  oldPassword: string;
  passwordRepeat: string;
}

export interface UpdateNicknameDto {
  nickname: string;
}

export interface UpdateAvatarDto {
  avatarSrc: string;
}

export interface SearchUserDto {
  username: string;
}

export interface UserListDto extends PageOptionsDto {}

export interface CreateUserDto {
  username: string;
  password: string;
  userRole?: UserRole;
}

export interface UpdateUserDto {
  password?: string;
  nickname?: string;
  avatarSrc?: string;
  userRole?: UserRole;
}
