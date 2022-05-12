import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { TDSOutletModule, TDSAvatarModule, TDSButtonModule, TDSToolTipModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSSelectModule, TDSBadgeModule, TDSModalModule, TDSSpinnerModule, TDSTypographyModule, TDSTagModule, TDSCheckBoxModule } from 'tmt-tang-ui';
import { TDSConversationsComponent } from './tds-conversations.component';
import { TDSConversationItemComponent } from './tds-conversation-item.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TDSPopoverModule } from 'tmt-tang-ui';
import { IconEmojiMartComponent } from '../emoji-mart/icon-emoji-mart.component';
import { UploadImageModule } from '../upload-image/tpage-avatar-facebook/upload-image.module';
import { TDSCardModule } from 'tmt-tang-ui';
import { ShowAttachmentComponent } from '../show-attachment/show-attachment.component';
import { PipeModule } from '../pipe/pipe.module';
import { TDSImageModule } from 'tmt-tang-ui';
import {  TDSAlertModule } from 'tmt-tang-ui';
import { TDSCollapseModule } from 'tmt-tang-ui';

const CMP =[
  TDSConversationsComponent,
  TDSConversationItemComponent,
  IconEmojiMartComponent,
  ShowAttachmentComponent
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
    UploadImageModule,
    TDSCardModule,
    PipeModule,
    TDSImageModule,
    TDSCollapseModule,
    TDSTypographyModule,
    TDSAlertModule,
    TDSTagModule,
    TDSCheckBoxModule
  ],
  exports:[
    ...CMP
  ],
})

export class TDSConversationsModule { }
