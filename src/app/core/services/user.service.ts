import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import {
  SearchUserDto,
  UpdateAvatarDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserListDto,
  CreateUserDto,
} from '@interfaces/dto';
import { UserVo, UserListVo } from '@interfaces/vo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _currUser = new ReplaySubject<UserVo>(1);
  currUser$ = this._currUser.asObservable();

  constructor(private http: HttpClient) {}

  setCurrUser(user: UserVo): void {
    this._currUser.next(user);
  }

  searchUser(param: SearchUserDto): Observable<UserVo> {
    const httpParams = new HttpParams({
      fromObject: Object.assign(param),
    });
    return this.http.get<UserVo>('/api/user/search', { params: httpParams });
  }

  updateNickname(param: UpdateNicknameDto): Observable<void> {
    return this.http
      .patch<UserVo>('/api/user/nickname', param)
      .pipe(map((user) => this.setCurrUser(user)));
  }

  updateAvatar(param: UpdateAvatarDto): Observable<void> {
    return this.http
      .patch<UserVo>('/api/user/avatar', param)
      .pipe(map((user) => this.setCurrUser(user)));
  }

  updatePassword(param: UpdatePasswordDto): Observable<void> {
    return this.http.patch<UserVo>('/api/user/password', param).pipe(map(() => undefined));
  }

  // Functions for admin
  getUserList(param: UserListDto): Observable<UserListVo> {
    const httpParams = new HttpParams({
      fromObject: Object.assign(param),
    });
    return this.http.get<UserListVo>('/api/user/list', { params: httpParams });
  }

  createUser(param: CreateUserDto): Observable<UserVo> {
    return this.http.post<UserVo>('/api/user', param);
  }

  updateUser(userId: string, param: UpdateUserDto): Observable<UserVo> {
    return this.http.put<UserVo>(`/api/user/${userId}`, param);
  }

  deleteUser(userId: string): Observable<UserVo> {
    return this.http.delete<UserVo>(`/api/user/${userId}`);
  }
}
