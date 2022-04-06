import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '@core/services';

@Injectable()
export class SocketService {
  private _socket: Socket;

  constructor(private authService: AuthService) {
    const token = this.authService.token;
    if (!token) {
      throw new Error('用户token不存在, 无法连接socket');
    }
    this._socket = io('/events', { auth: { token }, autoConnect: false, reconnectionAttempts: 3 });
  }

  connectSocket(): void {
    this._socket.connect();
  }

  disconnectSocket(): void {
    this._socket.disconnect();
  }

  ngOnDestroy(): void {
    this._socket.disconnect();
  }

  emit<T>(event: string, data?: T): void {
    this._socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      this._socket.on(event, (data: T) => {
        observer.next(data);
      });
    });
  }
}
