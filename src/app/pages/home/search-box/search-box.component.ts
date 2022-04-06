import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FriendSmVo, RoomSmVo } from '@interfaces/vo';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';

interface IOption {
  id: string;
  name: string;
  avatarSrc?: string;
  icon: string;
  className: string;
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.less'],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() candidates!: Observable<RoomSmVo[] | FriendSmVo[]>;
  @Output() itemEvent = new EventEmitter<string>();

  private _notifier = new Subject<string>();
  private _value = new Subject<string>();
  options: IOption[] = [];
  inputValue: string = '';

  constructor() {}

  ngOnInit(): void {
    combineLatest([this.candidates, this._value])
      .pipe(takeUntil(this._notifier))
      .subscribe(([data, value]) => {
        this.options = [];
        data.forEach((item) => {
          if (value && item.name.match(value)) {
            const option: IOption = {
              id: item.id,
              name: item.name,
              avatarSrc: item.avatarSrc,
              icon: 'icon' in item ? item.icon : 'user',
              className: 'className' in item ? item.className : 'avatar-friend',
            };
            this.options.push(option);
          }
        });
      });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.next(value);
  }

  onEnter(): void {
    const result = this.options.find((option) => option.name === this.inputValue);
    if (result) {
      this.itemEvent.emit(result.id);
    }
  }

  ngOnDestroy(): void {
    this._notifier.next('');
  }
}
