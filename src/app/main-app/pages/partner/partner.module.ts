import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner/partner.component';
import { TDSButtonModule, TDSTabsModule, TDSModalService, TDSFormFieldModule, TDSInputModule, TDSDropDownModule, TDSTableModule, TDSTagModule, TDSAvatarModule, TDSBadgeModule, TDSPopoverModule, TDSSkeletonModule, TDSSelectModule, TDSToolTipModule, TDSModalModule, TDSRadioModule, TDSDatePickerModule, TDSCheckBoxModule, TDSInputNumberModule, TDSButtonSpitModule, TDSDrawerModule } from 'tmt-tang-ui';
import { InfoOrderDebtOfPartnerComponent } from './partner/info-order-debt-of-partner/info-order-debt-of-partner.component';
import { ModalAddPartnerComponent } from './partner/modal-add-partner/modal-add-partner.component';
import { ModalAddAddressComponent } from './partner/modal-add-address/modal-add-address.component';
import { ModalEditPartnerComponent } from './partner/modal-edit-partner/modal-edit-partner.component';
import { ModalResetPointComponent } from './partner/modal-reset-point/modal-reset-point.component';
import { ModalConvertPartnerComponent } from './partner/modal-convert-partner/modal-convert-partner.component';
import { ModalSendMessageComponent } from './partner/modal-send-message/modal-send-message.component';
import { ModalSampleMessageComponent } from './partner/modal-send-message/modal-sample-message/modal-sample-message.component';
import { ModalBirthdayPartnerComponent } from './partner/modal-birthday-partner/modal-birthday-partner.component';
import { ModalPaymentComponent } from './partner/modal-payment/modal-payment.component';
import { DrawerMessageComponent } from './partner/drawer-message/drawer-message.component';


@NgModule({
  declarations: [
    PartnerComponent,
    InfoOrderDebtOfPartnerComponent,
    ModalAddPartnerComponent,
    ModalAddAddressComponent,
    ModalEditPartnerComponent,
    ModalResetPointComponent,
    ModalConvertPartnerComponent,
    ModalSendMessageComponent,
    ModalSampleMessageComponent,
    ModalBirthdayPartnerComponent,
    ModalPaymentComponent,
    DrawerMessageComponent,
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    TDSButtonModule,
    TDSTabsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSDropDownModule,
    TDSTableModule,
    TDSTagModule,
    TDSAvatarModule,
    TDSBadgeModule,
    TDSPopoverModule,
    TDSSelectModule ,
    FormsModule,
    TDSToolTipModule,
    TDSModalModule,
    FormsModule,
    ReactiveFormsModule,
    TDSRadioModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSInputNumberModule,
    TDSButtonSpitModule,
    TDSAvatarModule,
    TDSDrawerModule,
  ]
})
export class PartnerModule { }
