import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTime',
})
export class CustomTimePipe implements PipeTransform {
  transform(cdate: Date, fmt: string = 'small'): string {
    const now = new Date();
    let createTime: Date;
    if (cdate instanceof Date) {
      createTime = cdate;
    } else {
      createTime = new Date(cdate);
    }
    if (createTime.getFullYear() === now.getFullYear()) {
      if (createTime.getMonth() === now.getMonth()) {
        if (createTime.getDate() === now.getDate()) {
          // today
          if (fmt === 'small') {
            return `${createTime.getHours()}:${('0' + createTime.getMinutes()).slice(-2)}`;
          } else {
            return createTime.toLocaleTimeString();
          }
        } else if (createTime.getDate() === now.getDate() - 1) {
          // yesterday
          if (fmt === 'small') {
            return '昨天';
          } else {
            return '昨天' + createTime.toLocaleTimeString();
          }
        } else {
          if (fmt === 'small') {
            const month = createTime.getMonth() + 1;
            const date = createTime.getDate();
            return `${month}月${date}日`;
          } else {
            return createTime.toLocaleDateString();
          }
        }
      } else {
        if (fmt === 'small') {
          const month = createTime.getMonth() + 1;
          const date = createTime.getDate();
          return `${month}月${date}日`;
        } else {
          return createTime.toLocaleDateString();
        }
      }
    } else {
      if (fmt === 'small') {
        const year = createTime.getFullYear();
        return `${year}年`;
      } else {
        return createTime.toLocaleDateString();
      }
    }
  }
}
