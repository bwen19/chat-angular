import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let msg: string = '';
    const status = error.status;
    if (status === 0) {
      msg = '客户端或网络出错, 请检查';
    } else if (status >= 300 && status < 400) {
      msg = '请求被服务器重定向';
    } else if (status === 400) {
      msg = error.error.message || '请求出错';
    } else if (status >= 400 && status < 500) {
      msg = error.error.message || '请求出错';
    } else if (status >= 500) {
      msg = '服务器内部错误';
    }
    return throwError(() => new Error(msg));
    // return of();
  }
}
