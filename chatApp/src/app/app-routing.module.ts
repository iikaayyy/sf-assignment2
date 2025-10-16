import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ChatComponent } from './chat/chat.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'groups', component: DashboardComponent },
  { path: 'groups/:name', component: GroupChatComponent },
  { path: 'groups/:name/:channelName', component: ChatComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'groups/:name/:channelName/:roomName/video-chat',
    component: VideoChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
