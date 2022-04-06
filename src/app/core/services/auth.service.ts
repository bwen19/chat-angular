import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { TOKEN_KEY, UserRole } from '@constants';
import { UserLoginDto, UserRegisterDto } from '@interfaces/dto';
import { AuthVo, UserVo } from '@interfaces/vo';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;
  private _isAdmin = false;
  private _accessToken = localStorage.getItem(TOKEN_KEY);
  private _redirectUrl = '/passport/welcome';

  get isAdmin(): boolean {
    return this._isAdmin;
  }
  get token(): string | null {
    return this._accessToken && `bearer ${this._accessToken}`;
  }

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  clearAuth(): void {
    this._isLoggedIn = false;
    this._accessToken = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  getCsrfToken(): void {
    this.http.head<void>('/api/auth/csrf').subscribe();
  }

  login(userLoginDto: UserLoginDto): Observable<void> {
    return this.http.post<AuthVo>('/api/auth/login', userLoginDto).pipe(
      map((authVo) => {
        this._isLoggedIn = true;
        this._isAdmin = authVo.user.userRole === UserRole.ADMIN;
        this.userService.setCurrUser(authVo.user);
        this._accessToken = authVo.accessToken;
        localStorage.setItem(TOKEN_KEY, this._accessToken);
        this.router.navigateByUrl(this._redirectUrl);
        this._redirectUrl = '/passport/welcome';
      }),
    );
  }

  register(userRegisterDto: UserRegisterDto): Observable<UserVo> {
    return this.http.post<UserVo>('/api/auth/register', userRegisterDto);
  }

  checkAuth(requestUrl: string): Observable<boolean | UrlTree> {
    if (this._isLoggedIn) {
      return of(true);
    } else if (this._accessToken) {
      return this.http.get<UserVo>('/api/auth/check').pipe(
        map((user) => {
          this._isLoggedIn = true;
          this._isAdmin = user.userRole === UserRole.ADMIN;
          this.userService.setCurrUser(user);
          return true;
        }),
        catchError(() => {
          this._redirectUrl = requestUrl;
          return of(this.router.parseUrl('/passport/login'));
        }),
      );
    } else {
      this._redirectUrl = requestUrl;
      return of(this.router.parseUrl('/passport/login'));
    }
  }

  checkRole(requestUrl: string): Observable<boolean | UrlTree> {
    return this.checkAuth(requestUrl).pipe(
      map((value: boolean | UrlTree) => {
        if (value instanceof UrlTree) {
          return value;
        } else {
          if (value && this._isAdmin) {
            return true;
          } else {
            return this.router.parseUrl('/403');
          }
        }
      }),
    );
  }
}
