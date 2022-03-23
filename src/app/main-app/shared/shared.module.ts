import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule, TDSOutletModule, TDSScrollIntoViewModule } from 'tmt-tang-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';


const cmp =[
  TpageTeamDropdownComponent
]
@NgModule({
  declarations: [  
    ...cmp
  ],
  imports: [
    CommonModule,
    FormsModule,
    
  ],
  exports:[
   ...cmp
  ]
})
export class MainSharedModule { }
