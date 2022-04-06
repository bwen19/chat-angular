import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { NotFoundPageRoutingModule } from './not-found-page-routing.module';
import { NotFoundPageComponent } from './not-found-page.component';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [SharedModule, NotFoundPageRoutingModule],
})
export class NotFoundPageModule {}
