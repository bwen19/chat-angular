import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `<nz-result nzStatus="404" nzTitle="404" nzSubTitle="对不起,您访问的页面不存在.">
    <div nz-result-extra>
      <button nz-button nzType="primary" routerLink="/">返回主页</button>
    </div>
  </nz-result>`,
})
export class NotFoundPageComponent {}
