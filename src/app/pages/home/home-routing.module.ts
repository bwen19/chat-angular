import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards';

import { HomeComponent } from './home.component';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      {
        path: 'chat',
        component: ChatComponent,
        data: { reuse: true },
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { reuse: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
