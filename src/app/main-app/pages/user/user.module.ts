import { EventSummaryService } from './../../services/event-summary.service';
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
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { TDSSkeletonModule } from 'tds-ui/skeleton';
import { ModalGetNotificationComponent } from './components/modal-get-notification/modal-get-notification.component';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSTableModule } from 'tds-ui/table';
import { ActivitiesComponent } from './activities/activities.component';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { OdataTPosLoggingService } from '@app/services/mock-odata/odata-tpos-logging.service';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { TDSImageModule } from 'tds-ui/image';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSPaginationModule } from 'tds-ui/pagination';
import { TDSAlertModule } from 'tds-ui/alert';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSNotificationModule } from 'tds-ui/notification';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { ModalRequestPermissionComponent } from './components/modal-request-permission/modal-request-permission.component';
import { SocketNotificationComponent } from './socket-notification/socket-notification.component';

const SERVICES = [
  TenantService,
  FirebaseRegisterService,
  OdataTPosLoggingService,
  EventSummaryService
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
    ModalGetNotificationComponent,
    ActivitiesComponent,
    ModalRequestPermissionComponent,
    SocketNotificationComponent
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
    VirtualScrollerModule,
    TDSSkeletonModule,
    TDSModalModule,
    TDSCheckBoxModule,
    TDSTableModule,
    TDSBadgeModule,
    TDSDropDownModule,
    TDSButtonMenuModule,
    TDSSwitchModule,
    TDSInputNumberModule,
    TDSToolTipModule,
    TDSButtonMenuModule,
    TDSRadioModule,
    TDSBreadCrumbModule,
    TDSImageModule,
    TDSTagModule,
    TDSDatePickerModule,
    TDSPaginationModule,
    TDSTimePickerModule,
    TDSFilterStatusModule,
    TDSNotificationModule,
    TDSCollapseModule,
    TDSEmptyModule,
    TDSAlertModule,
  ],
  providers: [
    ...SERVICES
  ]
})
export class UserModule { }
