import { ShowItemImageComponent } from './../show-item-image/show-item-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CRMTagService } from './../../services/crm-tag.service';
import { QuickReplyService } from './../../services/quick-reply.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { TDSConversationsComponent } from './tds-conversations.component';
import { TDSConversationItemComponent } from './tds-conversation-item.component';
import { IconEmojiMartComponent } from '../emoji-mart/icon-emoji-mart.component';
import { UploadImageModule } from '../upload-image/tpage-avatar-facebook/upload-image.module';
import { ShowAttachmentComponent } from '../show-attachment/show-attachment.component';
import { PipeModule } from '../pipe/pipe.module';
import { MainSharedModule } from 'src/app/main-app/shared/shared.module';
import { DirectivesModule } from '../directives/directives.module';
import { ActivityFacebookState } from '../../services/facebook-state/activity-facebook.state';
import { TDSAlertModule } from 'tds-ui/alert';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSOutletModule } from 'tds-ui/core/outlet';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSCardModule } from 'tds-ui/card';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSImageModule } from 'tds-ui/image';
import { TDSMessageModule } from 'tds-ui/message';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormatIconLikePipe } from '../pipe/format-icon-like.pipe';
import { TDSConversationsV2Component } from './tds-conversations-v2.component';
import { TDSConversationItemV2Component } from './tds-conversation-item-v2.component';
import { ConversationInfopostItemComponent } from './component/conversation-infopost-item/conversation-infopost-item.component';

const CMP =[
  TDSConversationsComponent,
  TDSConversationsV2Component,
  TDSConversationItemComponent,
  TDSConversationItemV2Component,
  IconEmojiMartComponent,
  ShowAttachmentComponent,
  ShowItemImageComponent,
  ConversationInfopostItemComponent
]

@NgModule({
  declarations: [
   ...CMP
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    TDSPopoverModule,
    UploadImageModule,
    TDSCardModule,
    PipeModule,
    TDSImageModule,
    TDSSwitchModule,
    TDSTagModule,
    TDSCollapseModule,
    TDSTypographyModule,
    TDSAlertModule,
    TDSTagModule,
    TDSCheckBoxModule,
    TDSUploadModule,
    MainSharedModule,
    DirectivesModule,
    TDSEmptyModule,
    TDSMessageModule,
    PickerModule,
    EmojiModule
  ],
  exports:[
    ...CMP
  ],
  providers:[
    QuickReplyService,
    CRMTagService,
    ActivityFacebookState,
    FormatIconLikePipe
  ]
})

export class TDSConversationsModule { }
