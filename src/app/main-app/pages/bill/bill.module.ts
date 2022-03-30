import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill/bill.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSButtonModule, TDSTabsModule, TDSModalService, TDSFormFieldModule, TDSInputModule, TDSDropDownModule, TDSTableModule, TDSTagModule, TDSAvatarModule, TDSBadgeModule, TDSPopoverModule, TDSSkeletonModule, TDSSelectModule, TDSToolTipModule, TDSModalModule, TDSRadioModule, TDSDatePickerModule, TDSCheckBoxModule, TDSInputNumberModule, TDSButtonSpitModule, TDSDrawerModule, TDSContextMenuService, TDSFilterStatusModule, TDSSpinnerModule, TDSPageHeaderModule, TDSBreadCrumbModule, TDSCollapseModule } from 'tmt-tang-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { OdataFastSaleOrderService } from '../../services/mock-odata/odata-fastsaleorder.service';
import { TagService } from '../../services/tag.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { DeliveryCarrierService } from '../../services/delivery-carrier-order.service';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { FilterOptionsComponent } from './components/filter-option/filter-options.component';
import { ConfigColumComponent } from './components/config-column/config-column.component';
import { PrinterService } from '../../services/printer.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { PaymentRequestComponent } from './components/payment-request/payment-request.component';
import { SendDeliveryComponent } from './components/send-delivery/send-delivery.component';
import {  TDSAlertModule } from 'tmt-tang-ui';
import { PaymentMultipComponent } from './components/payment-multip/payment-multip.component';
import { TDSNotificationModule } from 'tmt-tang-ui';
import { AccountRegisterPaymentService } from '../../services/account-register-payment..service';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { ModalSearchPartnerComponent } from './components/add-bill/components/modal-search-partner/modal-search-partner.component';
import { ModalAddProductComponent } from './components/add-bill/components/modal-add-product/modal-add-product.component';

const SERVICES = [
  FastSaleOrderService,
  OdataFastSaleOrderService,
  TagService,
  DeliveryCarrierService,
  PrinterService,
  ExcelExportService,
  AccountRegisterPaymentService
]

@NgModule({
  declarations: [
    BillComponent,
    ActionDropdownComponent,
    FilterOptionsComponent,
    ConfigColumComponent,
    PaymentRequestComponent,
    SendDeliveryComponent,
    PaymentMultipComponent,
    AddBillComponent,
    ModalSearchPartnerComponent,
    ModalAddProductComponent
  ],

  imports: [
    CommonModule,
    BillRoutingModule,
    MainSharedModule,
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
    PipeModule,
    TDSSpinnerModule,
    TDSNotificationModule,
    TDSAlertModule,
    TDSPageHeaderModule,
    TDSBreadCrumbModule,
    TDSTabsModule,
    TDSCollapseModule
  ],
  providers: [
   ...SERVICES,
  ],
})

export class BillModule { }
