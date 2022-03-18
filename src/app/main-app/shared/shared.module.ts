import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSConversationsComponent } from './tds-conversations/tds-conversations.component';
import { FormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule } from 'tmt-tang-ui';

const CMP =[
  TDSConversationsComponent
]

@NgModule({
  declarations: [
    TDSConversationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TDSAvatarModule,
    TDSButtonModule
  ],
  exports:[
    TDSConversationsComponent
  ]
})
export class MainSharedModule { }
