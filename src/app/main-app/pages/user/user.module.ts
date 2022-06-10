import { InfoUserComponent } from './components/info-user/info-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { TDSButtonModule, TDSAvatarModule, TDSFormFieldModule, TDSInputModule, TDSUploadModule, TDSSpinnerModule, TDSCardModule, TDSSelectModule, TDSPopoverModule, TDSTabsModule } from 'tmt-tang-ui';
import { TenantService } from '../../services/tenant.service';
import { TDSEchartsModule } from 'tds-report';
import { PackOfDataComponent } from './pack-of-data/pack-of-data.component';
import { InfoPackOfDataComponent } from './components/info-pack-of-data/info-pack-of-data.component';
import { ChoosePackOfDataComponent } from './components/choose-pack-of-data/choose-pack-of-data.component';
import { ExtendPackOfDataComponent } from './components/extend-pack-of-data/extend-pack-of-data.component';
import { InfoPaymentPackOfDataComponent } from './components/info-payment-pack-of-data/info-payment-pack-of-data.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { PipeModule } from '../../shared/pipe/pipe.module';

const SERVICES = [
  TenantService
]

@NgModule({
  declarations: [
    UserComponent,
    InfoUserComponent,
    NotificationComponent,
    PackOfDataComponent,
    InfoPackOfDataComponent,
    ChoosePackOfDataComponent,
    ExtendPackOfDataComponent,
    InfoPaymentPackOfDataComponent,
    NotificationListComponent,
    NotificationDetailComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TDSButtonModule,
    TDSAvatarModule,
    TDSFormFieldModule,
    TDSInputModule,
    FormsModule,
    ReactiveFormsModule,
    TDSUploadModule,
    TDSSpinnerModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TDSCardModule,
    TDSSelectModule,
    TDSPopoverModule,
    TDSTabsModule,
    PipeModule
  ],
  providers: [
    ...SERVICES
  ]
})
export class UserModule { }
