import { ShowItemImageComponent } from './../show-item-image/show-item-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CRMTagService } from './../../services/crm-tag.service';
import { QuickReplyService } from './../../services/quick-reply.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { TDSOutletModule, TDSAvatarModule, TDSButtonModule, TDSToolTipModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSSelectModule, TDSBadgeModule, TDSModalModule, TDSSpinnerModule, TDSCheckBoxModule, TDSSwitchModule, TDSTagModule,TDSTypographyModule, TDSEmptyModule  } from 'tmt-tang-ui';
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
import { TDSAlertModule } from 'tmt-tang-ui';
import { TDSCollapseModule } from 'tmt-tang-ui';
import { TDSUploadModule } from "tmt-tang-ui";
import { MainSharedModule } from 'src/app/main-app/shared/shared.module';
import { DirectivesModule } from '../directives/directives.module';
import { ActivityFacebookState } from '../../services/facebook-state/activity-facebook.state';

const CMP =[
  TDSConversationsComponent,
  TDSConversationItemComponent,
  IconEmojiMartComponent,
  ShowAttachmentComponent,
  ShowItemImageComponent,
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
    PickerModule,
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
  ],
  exports:[
    ...CMP
  ],
  providers:[
    QuickReplyService,
    CRMTagService,
    ActivityFacebookState
  ]
})

export class TDSConversationsModule { }
