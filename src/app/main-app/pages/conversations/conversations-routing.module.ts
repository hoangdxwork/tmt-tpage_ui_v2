import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationCommentComponent } from './conversation-comment/conversation-comment.component';
import { ConversationInboxComponent } from './conversation-inbox/conversation-inbox.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';

const routes: Routes = [
    {
    path: 'all',
    component: ConversationAllComponent
  },
  {
    path: 'inbox',
    component: ConversationInboxComponent
  },
  {
    path: 'comment',
    component: ConversationCommentComponent
  },
  {
    path: 'post',
    component: ConversationPostComponent
  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConversationsRoutingModule { }
