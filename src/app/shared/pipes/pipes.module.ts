import { NgModule } from '@angular/core';
import { CustomTimePipe } from './custom-time.pipe';

@NgModule({
  declarations: [CustomTimePipe],
  exports: [CustomTimePipe],
})
export class PipesModule {}
