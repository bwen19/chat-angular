import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ForbiddenPageRoutingModule } from './forbidden-page-routing.module';
import { ForbiddenPageComponent } from './forbidden-page.component';

@NgModule({
  declarations: [ForbiddenPageComponent],
  imports: [SharedModule, ForbiddenPageRoutingModule],
})
export class ForbiddenPageModule {}
