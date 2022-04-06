import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserService } from '@core/services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private _notifier = new Subject<string>();

  username?: string;
  isAdmin?: boolean;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currUser$
      .pipe(takeUntil(this._notifier))
      .subscribe((user) => (this.username = user.nickname));
    this.isAdmin = this.authService.isAdmin;
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }
}
