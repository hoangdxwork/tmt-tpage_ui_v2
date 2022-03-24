import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule, TDSCollapseModule, TDSDropDownModule, TDSOutletModule, TDSScrollIntoViewModule } from 'tmt-tang-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';
import { TpageBaseComponent } from './tpage-base/tpage-base.component';
import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook/tpage-avatar-facebook.component';


const cmp =[
  TpageTeamDropdownComponent,
  TpageBaseComponent,
  TpageAvatarFacebookComponent, 
]
@NgModule({
  declarations: [  
    ...cmp,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TDSAvatarModule,
    TDSCollapseModule,
    TDSDropDownModule
  ],
  exports:[
   ...cmp
  ]
})
export class MainSharedModule { }
