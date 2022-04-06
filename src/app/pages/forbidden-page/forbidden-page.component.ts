import { Component } from '@angular/core';

@Component({
  selector: 'app-page-forbidden',
  template: `<nz-result nzStatus="403" nzTitle="403" nzSubTitle="对不起,您没有权限访问此页面.">
    <div nz-result-extra>
      <button nz-button nzType="primary" routerLink="/">返回主页</button>
    </div>
  </nz-result>`,
})
export class ForbiddenPageComponent {}
