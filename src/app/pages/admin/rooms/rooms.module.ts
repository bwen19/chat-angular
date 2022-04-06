import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';

@NgModule({
  declarations: [RoomsComponent],
  imports: [SharedModule, RoomsRoutingModule],
})
export class RoomsModule {}
