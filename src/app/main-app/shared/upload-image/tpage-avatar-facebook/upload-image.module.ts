import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook.component';
import { PipeModule } from '../../pipe/pipe.module';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSTableModule } from 'tds-ui/table';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';

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
    TDSSpinnerModule,
    PipeModule,
  ],
  exports:[
   ...cmp
  ],
  providers: [],
})
export class UploadImageModule { }
