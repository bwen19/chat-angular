import { NgModule, Optional, SkipSelf } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { CustomReuseStrategy } from './strategies';
import { interceptorProviders } from './interceptors';

registerLocaleData(zh);

@NgModule({
  providers: [
    interceptorProviders,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
