import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
import { ZORRO_MODULES } from './zorro-modules';

const MODULES = [CommonModule, FormsModule, ReactiveFormsModule, PipesModule, ...ZORRO_MODULES];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class SharedModule {}
