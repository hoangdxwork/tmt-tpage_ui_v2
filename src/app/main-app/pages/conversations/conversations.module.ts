import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';
import { ConversationPartnerComponent } from './conversation-partner/conversation-partner.component';
import { ConversationCommentComponent } from './conversation-comment/conversation-comment.component';
import { ConversationInboxComponent } from './conversation-inbox/conversation-inbox.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBadgeModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormFieldModule, TDSInputModule, TDSModalModule, TDSPopoverModule, TDSRadioModule, TDSScrollIntoViewModule, TDSSelectModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSToolTipModule } from 'tmt-tang-ui';
import { TDSConversationsModule } from '../../shared/tds-conversations/tds-conversations.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalImageStoreComponent } from './components/modal-image-store/modal-image-store.component';


@NgModule({
  declarations: [
    ConversationAllComponent,
    ConversationPostComponent,
    ConversationPartnerComponent,
    ConversationCommentComponent,
    ConversationInboxComponent,
    ModalImageStoreComponent
  ],
  imports: [
    CommonModule,
    ConversationsRoutingModule,
    MainSharedModule,
    TDSConversationsModule,
    ReactiveFormsModule,
    FormsModule,
    TDSAvatarModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSAutocompleteModule,
    TDSBadgeModule,
    TDSTagModule,
    TDSPopoverModule,
    TDSTabsModule,
    TDSButtonModule,
    TDSButtonMenuModule,
    TDSDropDownModule,
    TDSCollapseModule,
    TDSFilterStatusModule,
    TDSTableModule,
    TDSCheckBoxModule,
    TDSRadioModule,
    TDSToolTipModule,
    TDSModalModule
  ]
})
export class ConversationsModule { }
