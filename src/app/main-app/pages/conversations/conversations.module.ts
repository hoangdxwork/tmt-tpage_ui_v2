import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';
import { ConversationPartnerComponent } from './conversation-partner/conversation-partner.component';
import { ConversationCommentComponent } from './conversation-comment/conversation-comment.component';
import { ConversationInboxComponent } from './conversation-inbox/conversation-inbox.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSScrollIntoViewModule } from 'tmt-tang-ui';
import { TDSConversationsModule } from '../../shared/tds-conversations/tds-conversations.module';


@NgModule({
  declarations: [
    ConversationAllComponent,
    ConversationPostComponent,
    ConversationPartnerComponent,
    ConversationCommentComponent,
    ConversationInboxComponent
  ],
  imports: [
    CommonModule,
    ConversationsRoutingModule,
    MainSharedModule,
    TDSConversationsModule
  ]
})
export class ConversationsModule { }
