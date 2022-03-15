import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { TDSPageHeaderModule, TDSTagModule, TDSButtonModule, TDSBreadCrumbModule, TDSAvatarModule, TDSFormFieldModule, TDSInputModule } from 'tmt-tang-ui';
import { InfoUserComponent } from './user/info-user/info-user.component';


@NgModule({
  declarations: [
    UserComponent,
    InfoUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TDSPageHeaderModule,
    TDSTagModule,
    TDSButtonModule,
    TDSBreadCrumbModule,
    TDSAvatarModule,
    TDSFormFieldModule,
    TDSInputModule,
    FormsModule,
  ]
})
export class UserModule { }
