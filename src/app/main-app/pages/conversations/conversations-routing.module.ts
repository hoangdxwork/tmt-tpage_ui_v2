import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';

const routes: Routes = [
  {
    path: 'all',
    component: ConversationAllComponent
  },
  {
    path: 'inbox',
    component: ConversationAllComponent
  },
  {
    path: 'comment',
    component: ConversationAllComponent
  },
  {
    path: 'post',
    component: ConversationPostComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConversationsRoutingModule { }
