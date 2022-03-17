import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { TDSPageHeaderModule, TDSTagModule, TDSButtonModule, TDSBreadCrumbModule, TDSAvatarModule, TDSFormFieldModule, TDSInputModule, TDSCardModule, TDSSelectModule } from 'tmt-tang-ui';
import { InfoUserComponent } from './user/info-user/info-user.component';
import { InfoPackOfDataComponent } from './user/pack-of-data/info-pack-of-data/info-pack-of-data.component';
import { ChoosePackOfDataComponent } from './user/pack-of-data/choose-pack-of-data/choose-pack-of-data.component';
import { ExtendPackOfDataComponent } from './user/pack-of-data/extend-pack-of-data/extend-pack-of-data.component';
import { InfoPaymentPackOfDataComponent } from './user/pack-of-data/info-payment-pack-of-data/info-payment-pack-of-data.component';
import { TDSEchartsModule } from 'tds-report';


@NgModule({
  declarations: [
    UserComponent,
    InfoUserComponent,
    InfoPackOfDataComponent,
    ChoosePackOfDataComponent,
    ExtendPackOfDataComponent,
    InfoPaymentPackOfDataComponent
  ],
  imports: [
    CommonModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    UserRoutingModule,
    TDSPageHeaderModule,
    TDSTagModule,
    TDSButtonModule,
    TDSBreadCrumbModule,
    TDSAvatarModule,
    TDSFormFieldModule,
    TDSInputModule,
    FormsModule,
    ReactiveFormsModule,
    TDSCardModule,
    TDSSelectModule
  ]
})
export class UserModule { }
