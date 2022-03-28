import { DrawerMessageComponent } from './components/drawer-message/drawer-message.component';
import { ModalPaymentComponent } from './components/modal-payment/modal-payment.component';
import { ModalBirthdayPartnerComponent } from './components/modal-birthday-partner/modal-birthday-partner.component';
import { ModalSampleMessageComponent } from './components/modal-sample-message/modal-sample-message.component';
import { ModalSendMessageComponent } from './components/modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './components/modal-convert-partner/modal-convert-partner.component';
import { ModalResetPointComponent } from './components/modal-reset-point/modal-reset-point.component';
import { ModalEditPartnerComponent } from './components/modal-edit-partner/modal-edit-partner.component';
import { ModalAddAddressComponent } from './components/modal-add-address/modal-add-address.component';
import { ModalAddPartnerComponent } from './components/modal-add-partner/modal-add-partner.component';
import { InfoOrderDebtOfPartnerComponent } from './components/info-order-debt-of-partner/info-order-debt-of-partner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner/partner.component';
import { TDSButtonModule, TDSTabsModule, TDSModalService, TDSFormFieldModule, TDSInputModule, TDSDropDownModule, TDSTableModule, TDSTagModule, TDSAvatarModule, TDSBadgeModule, TDSPopoverModule, TDSSkeletonModule, TDSSelectModule, TDSToolTipModule, TDSModalModule, TDSRadioModule, TDSDatePickerModule, TDSCheckBoxModule, TDSInputNumberModule, TDSButtonSpitModule, TDSDrawerModule, TDSFilterStatusModule, TDSSpinnerModule } from 'tmt-tang-ui';



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
    TDSFilterStatusModule,
    TDSSpinnerModule,
    
  ]
})
export class PartnerModule { }
