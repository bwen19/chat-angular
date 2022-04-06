import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { PassportRoutingModule } from './passport-routing.module';
import { PassportComponent } from './passport.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { passportIcons } from './passport.icons';

@NgModule({
  declarations: [PassportComponent, WelcomeComponent, LoginComponent, RegisterComponent],
  imports: [SharedModule, NzIconModule.forChild(passportIcons), PassportRoutingModule],
})
export class PassportModule {}
