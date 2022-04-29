import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { TDSOutletModule, TDSAvatarModule, TDSButtonModule, TDSToolTipModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSSelectModule, TDSBadgeModule, TDSModalModule, TDSSpinnerModule} from 'tmt-tang-ui';
import { TDSConversationsComponent } from './tds-conversations.component';
import { TDSConversationItemComponent } from './tds-conversation-item';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TDSPopoverModule } from 'tmt-tang-ui';
import { IconEmojiMartComponent } from '../emoji-mart/icon-emoji-mart.component';
import { UploadImageModule } from '../upload-image/tpage-avatar-facebook/upload-image.module';

const CMP =[
  TDSConversationsComponent,
  TDSConversationItemComponent,
  IconEmojiMartComponent
]

@NgModule({
  declarations: [
   ...CMP
  ],
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    TDSOutletModule,
    TDSAvatarModule,
    TDSButtonModule,
    TDSToolTipModule,
    TDSDropDownModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSSelectModule,
    TDSBadgeModule,
    TDSModalModule,
    TDSSpinnerModule,
    PickerModule,
    TDSPopoverModule,
    UploadImageModule
  ],
  exports:[
    ...CMP
  ]
})

export class TDSConversationsModule { }
