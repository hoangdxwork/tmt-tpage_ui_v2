import { PackOfDataModule } from './components/pack-of-data/pack-of-data.module';
import { InfoUserComponent } from './components/info-user/info-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { TDSButtonModule, TDSAvatarModule, TDSFormFieldModule, TDSInputModule } from 'tmt-tang-ui';
import { NotificationUserComponent } from './components/notification-user/notification-user.component';


@NgModule({
  declarations: [
    UserComponent,
    InfoUserComponent,
    NotificationUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    PackOfDataModule,
    TDSButtonModule,
    TDSAvatarModule,
    TDSFormFieldModule,
    TDSInputModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
