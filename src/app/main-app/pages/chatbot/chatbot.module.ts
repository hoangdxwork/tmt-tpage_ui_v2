import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ListChannelConnectComponent } from './components/list-channel-connect/list-channel-connect.component';
import { MainSharedModule } from '../../shared/shared.module';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { ConnectChatbotComponent } from './components/connect-chatbot/connect-chatbot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSSelectModule } from 'tds-ui/select';

const cmp =[
  ChatbotComponent,
  ListChannelConnectComponent,
  ConnectChatbotComponent
]

const SERVICES = [
  CompanyService
]

@NgModule({
  declarations: [
    ...cmp
  ],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    UploadImageModule,
    MainSharedModule,
    TDSButtonModule,
    TDSAvatarModule,
    TDSSwitchModule,
    TDSSpinnerModule,
    TDSBadgeModule,
    TDSModalModule,
    FormsModule,
    TDSFormFieldModule,
    TDSInputModule,
    ReactiveFormsModule,
    TDSSelectModule
  ],
  providers: [ ...SERVICES]
})
export class ChatbotModule { }
