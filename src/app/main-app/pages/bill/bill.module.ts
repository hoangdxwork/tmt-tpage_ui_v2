import { RestSMSService } from './../../services/sms.service';
import { QuickReplyService } from './../../services/quick-reply.service';
import { DetailBillComponent } from './detail-bill/detail-bill.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill/bill.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSButtonModule, TDSTabsModule, TDSFormFieldModule, TDSInputModule, TDSDropDownModule, TDSTableModule, TDSTagModule, TDSAvatarModule, TDSBadgeModule, TDSPopoverModule, TDSSkeletonModule, TDSSelectModule, TDSToolTipModule, TDSModalModule, TDSRadioModule, TDSDatePickerModule, TDSCheckBoxModule, TDSInputNumberModule, TDSButtonSpitModule, TDSDrawerModule, TDSFilterStatusModule, TDSSpinnerModule, TDSPageHeaderModule, TDSBreadCrumbModule, TDSCollapseModule, TDSStepsModule } from 'tmt-tang-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { OdataFastSaleOrderService } from '../../services/mock-odata/odata-fastsaleorder.service';
import { TagService } from '../../services/tag.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { FilterOptionsComponent } from './components/filter-option/filter-options.component';
import { ConfigColumComponent } from './components/config-column/config-column.component';
import { PrinterService } from '../../services/printer.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { PaymentRequestComponent } from './components/payment-request/payment-request.component';
import { SendDeliveryComponent } from './components/send-delivery/send-delivery.component';
import { TDSAlertModule } from 'tmt-tang-ui';
import { PaymentMultipComponent } from './components/payment-multip/payment-multip.component';
import { TDSNotificationModule } from 'tmt-tang-ui';
import { AccountRegisterPaymentService } from '../../services/account-register-payment.service';
import { ModalSearchPartnerComponent } from './components/modal-search-partner/modal-search-partner.component';
import { CommonService } from '../../services/common.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { PartnerService } from '../../services/partner.service';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { BillExpandComponent } from './components/bill-expand/bill-expand.component';
import { HistoryDeliveryStatusComponent } from './history-delivery-status/history-delivery-status.component';
import { HistoryDeliveryStatusDetailComponent } from './history-delivery-status-detail/history-delivery-status-detail.component';
import { AccountTaxService } from '../../services/account-tex.service';
import { ManualCrossCheckingModalComponent } from './components/manual-cross-checking-modal/manual-cross-checking-modal.component';
import { UpdateShipOrderInfoModalComponent } from './components/update-ship-order-info-modal/update-ship-order-info-modal.component';

const SERVICES = [
  FastSaleOrderService,
  OdataFastSaleOrderService,
  TagService,
  DeliveryCarrierService,
  PrinterService,
  ExcelExportService,
  AccountRegisterPaymentService,
  CommonService,
  PartnerService,
  FastSaleOrderLineService,
  QuickReplyService,
  RestSMSService,
  AccountTaxService
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
    DetailBillComponent,
    BillExpandComponent,
    HistoryDeliveryStatusComponent,
    HistoryDeliveryStatusDetailComponent,
    ManualCrossCheckingModalComponent,
    UpdateShipOrderInfoModalComponent
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
    TDSCollapseModule,
    TDSStepsModule,
    TDSButtonSpitModule
  ],
  providers: [
   ...SERVICES,
  ],
})

export class BillModule { }
