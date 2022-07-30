import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationAllV2Component } from './conversation-all/conversation-all-v2.component';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';

const routes: Routes = [
  {
    path: 'all',
    component: ConversationAllV2Component
  },
  {
    path: 'inbox',
    component: ConversationAllV2Component
  },
  {
    path: 'comment',
    component: ConversationAllV2Component
  },
  {
    path: 'post',
    component: ConversationPostComponent
  }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConversationsRoutingModule { }
