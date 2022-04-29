import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSBadgeModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSOutletModule, TDSScrollIntoViewModule, TDSSelectModule, TDSSpinnerModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSTypographyModule, TDSUploadModule } from 'tmt-tang-ui';
import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook.component';
import { PipeModule } from '../../pipe/pipe.module';

const cmp =[
  TpageAvatarFacebookComponent,
]

@NgModule({
  declarations: [
    ...cmp,
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
    ReactiveFormsModule,
    TDSSelectModule,
    TDSInputNumberModule,
    TDSCheckBoxModule,
    TDSTableModule,
    TDSBadgeModule,
    TDSTagModule,
    TDSTypographyModule,
    TDSUploadModule,
    TDSTypographyModule,
    TDSSpinnerModule,
    TDSTabsModule,
    PipeModule,
  ],
  exports:[
   ...cmp
  ],
  providers: [],
})
export class UploadImageModule { }
