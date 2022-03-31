import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSModalModule, TDSOutletModule, TDSScrollIntoViewModule } from 'tmt-tang-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';
import { TpageBaseComponent } from './tpage-base/tpage-base.component';
import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook/tpage-avatar-facebook.component';
import { TpageMenuLayoutComponent } from './tpage-menu-layout/tpage-menu-layout.component';
import { TpageMenuItemComponent } from './tpage-menu-item/tpage-menu-item.component';
import { SendMessageComponent } from './tpage-send-mesage/send-message.component';
import { PipeModule } from './pipe/pipe.module';
import { BrowserModule } from '@angular/platform-browser';


const cmp =[
  TpageTeamDropdownComponent,
  TpageBaseComponent,
  TpageAvatarFacebookComponent,
  TpageMenuLayoutComponent,
  SendMessageComponent
]
@NgModule({
  declarations: [
    ...cmp, TpageMenuItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TDSAvatarModule,
    TDSCollapseModule,
    TDSDropDownModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSButtonModule,
    TDSModalModule,
    ReactiveFormsModule
  ],
  exports:[
   ...cmp
  ]
})
export class MainSharedModule { }
