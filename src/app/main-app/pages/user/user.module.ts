import { TDSModalModule } from 'tds-ui/modal';
import { InfoUserComponent } from './components/info-user/info-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
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
import { TDSButtonModule } from 'tds-ui/button';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSCardModule } from 'tds-ui/card';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSSelectModule } from 'tds-ui/select';
import { ModalEditInfoUserComponent } from './components/modal-edit-info-user/modal-edit-info-user.component';
import { ModalChangePasswordComponent } from './components/modal-change-password/modal-change-password.component';
import { FirebaseNotificationComponent } from './firebase-notification/firebase-notification.component';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { FirebaseNotificationDetailComponent } from './components/firebase-notification-detail/firebase-notification-detail.component';

const SERVICES = [
  TenantService,
  FirebaseRegisterService
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
    NotificationDetailComponent,
    ModalEditInfoUserComponent,
    ModalChangePasswordComponent,
    FirebaseNotificationComponent,
    FirebaseNotificationDetailComponent
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
    PipeModule,
    TDSModalModule
  ],
  providers: [
    ...SERVICES
  ]
})
export class UserModule { }
