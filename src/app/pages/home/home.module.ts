import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChatComponent } from './chat/chat.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { ChatRoomDetailComponent } from './chat-room-detail/chat-room-detail.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { ContactComponent } from './contact/contact.component';
import { ContactFriendsComponent } from './contact-friends/contact-friends.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ContactNewFriendComponent } from './contact-new-friend/contact-new-friend.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { UpdateNicknameComponent } from './modals/update-nickname/update-nickname.component';
import { UpdateAvatarComponent } from './modals/update-avatar/update-avatar.component';
import { UpdatePasswordComponent } from './modals/update-password/update-password.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { homeIcons } from './home.icons';

@NgModule({
  declarations: [
    HomeComponent,
    ChatComponent,
    ChatRoomsComponent,
    ChatRoomDetailComponent,
    ChatWindowComponent,
    ChatMessagesComponent,
    ContactComponent,
    ContactFriendsComponent,
    ContactInfoComponent,
    ContactNewFriendComponent,
    CreateRoomComponent,
    SearchBoxComponent,
    UpdateNicknameComponent,
    UpdateAvatarComponent,
    UpdatePasswordComponent,
  ],
  imports: [SharedModule, NzIconModule.forChild(homeIcons), HomeRoutingModule],
})
export class HomeModule {}
