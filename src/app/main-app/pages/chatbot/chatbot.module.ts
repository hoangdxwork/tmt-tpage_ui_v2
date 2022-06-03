import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { TDSAvatarModule, TDSBadgeModule, TDSButtonModule, TDSFormFieldModule, TDSInputModule, TDSModalModule, TDSSelectModule, TDSSpinnerModule, TDSSwitchModule } from 'tmt-tang-ui';
import { ListChannelConnectComponent } from './components/list-channel-connect/list-channel-connect.component';
import { MainSharedModule } from '../../shared/shared.module';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { ConnectChatbotComponent } from './components/connect-chatbot/connect-chatbot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { CompanyService } from '../../services/company.service';

const cmp =[
  ChatbotComponent,
  ListChannelConnectComponent,
  ConnectChatbotComponent
]

const SERVICES = [
  DeliveryCarrierService,
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
