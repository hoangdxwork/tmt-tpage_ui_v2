import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { TDSOutletModule, TDSAvatarModule, TDSButtonModule} from 'tmt-tang-ui';
import { TDSConversationsComponent } from './tds-conversations.component';
import { TDSConversationItemComponent } from './tds-conversation-item';


const CMP =[
  TDSConversationsComponent,
  TDSConversationItemComponent
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
  ],
  exports:[
    ...CMP
  ]
})
export class TDSConversationsModule { }
