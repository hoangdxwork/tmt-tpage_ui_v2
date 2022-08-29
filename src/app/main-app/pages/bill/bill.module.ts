// import { prepareEditBillHandler } from '../../handler-v2/bill-handler/prepare-edit-bill.handler';
import { PrepareCopyBill } from './../../handler-v2/bill-handler/prepare-copy-bill.handler';
import { ConversationService } from './../../services/conversation/conversation.service';
import { ActivityMatchingService } from './../../services/conversation/activity-matching.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { OrderBillHandler } from '../../handler-v2/order-handler/order-bill.handler';
import { PreparePartnerHandler } from './../../handler-v2/bill-handler/prepare-partner.handler';
import { CalculateBillFeeHandler } from './../../handler-v2/bill-handler/calculate-bill-fee.handler';
import { GetServiceHandler } from './../../handler-v2/bill-handler/get-services.handler';
import { PrepareSuggestionsBillHandler } from './../../handler-v2/bill-handler/prepare-suggestions-bill.handler';
import { UpdateOrderLinesHandler } from './../../handler-v2/bill-handler/update-order-lines.handler';
import { OdataProductService } from './../../services/mock-odata/odata-product.service';
import { AttachmentState } from './../../services/facebook-state/attachment.state';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentDataFacade } from './../../services/facades/attachment-data.facade';
import { UploadImageModule } from './../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { CRMMatchingService } from './../../services/crm-matching.service';
import { TDSConversationsModule } from './../../shared/tds-conversations/tds-conversations.module';
import { ConversationOrderFacade } from './../../services/facades/conversation-order.facade';
import { ConversationEventFacade } from './../../services/facades/conversation-event.facade';
import { DraftMessageService } from './../../services/conversation/draft-message.service';
import { ConversationDataFacade } from './../../services/facades/conversation-data.facade';
import { ActivityDataFacade } from './../../services/facades/activity-data.facade';
import { TDSMessageService } from 'tds-ui/message';
import { RestSMSService } from './../../services/sms.service';
import { QuickReplyService } from './../../services/quick-reply.service';
import { DetailBillComponent } from './detail-bill/detail-bill.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill/bill.component';
import { MainSharedModule } from '../../shared/shared.module';
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
import { PaymentMultipComponent } from './components/payment-multip/payment-multip.component';
import { AccountRegisterPaymentService } from '../../services/account-register-payment.service';
import { ModalSearchPartnerComponent } from './components/modal-search-partner/modal-search-partner.component';
import { CommonService } from '../../services/common.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { PartnerService } from '../../services/partner.service';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { BillExpandComponent } from './components/bill-expand/bill-expand.component';
import { HistoryDeliveryStatusComponent } from './history-delivery-status/history-delivery-status.component';
import { HistoryDeliveryStatusDetailComponent } from './history-delivery-status-detail/history-delivery-status-detail.component';
import { AccountTaxService } from '../../services/account-tax.service';
import { CrossCheckingStatusComponent } from './components/cross-checking-status/cross-checking-status.component';
import { ShipCodeDeliveryComponent } from './components/ship-code-delivery/ship-code-delivery.component';
import { TDSAlertModule } from 'tds-ui/alert';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSButtonSpitModule } from 'tds-ui/buttton-split';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { TDSTableModule } from 'tds-ui/table';
import { TDSNotificationModule } from 'tds-ui/notification';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSStepsModule } from 'tds-ui/step';
import { TDSPageHeaderModule } from 'tds-ui/page-header';
import { ModalBatchRefundComponent } from './components/modal-batch-refund/modal-batch-refund.component';
import { AccountJournalService } from '../../services/account-journal.service';
import { ShipStatusDeliveryComponent } from './components/ship-status-delivery/ship-status-delivery.component';
import { PaymentJsonBillComponent } from './components/payment-json/payment-json-bill.component';
import { AccountPaymentJsonService } from '../../services/account-payment-json.service';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { ModalUpdateDeliveryFromExcelComponent } from './components/modal-update-delivery-from-excel/modal-update-delivery-from-excel.component';
import { ModalManualUpdateDeliveryComponent } from './components/modal-manual-update-delivery/modal-manual-update-delivery.component';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { UpdateShipExtraHandler } from '../../handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from '../../handler-v2/aship-v2/update-shipservice-extras.handler';
import { PrepareModelFeeV2Handler } from '../../handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from '../../handler-v2/aship-v2/select-shipservice-v2.handler';
import { UpdateShipmentDetailAshipHandler } from '../../handler-v2/aship-v2/shipment-detail-aship.handler';
import { AddBillHandler } from '../../handler-v2/bill-handler/add-bill.handler';
import { CreateFormBillHandler } from '../../handler-v2/bill-handler/create-form-bill.handler';
import { PrepareCopyItemHandler } from '@app/handler-v2/bill-handler/prepare-copy-item.handler';
import { ChatomniMessageService } from '@app/services/chatomni-service/chatomni-message.service';
import { SO_ComputeCaclHandler } from '@app/handler-v2/order-handler/compute-cacl.handler';
import { CalculateFeeAshipHandler } from '@app/handler-v2/aship-v2/calcfee-aship.handler';

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
  AccountTaxService,
  TDSMessageService,
  ActivityDataFacade,
  ConversationDataFacade,
  DraftMessageService,
  ConversationEventFacade,
  ConversationOrderFacade,
  CRMMatchingService,
  AttachmentDataFacade,
  AttachmentService,
  AttachmentState,
  OdataProductService,
  AccountJournalService,
  AccountPaymentJsonService,
  AddBillHandler,
  UpdateShipExtraHandler,
  UpdateShipServiceExtrasHandler,
  PrepareModelFeeV2Handler,
  SelectShipServiceV2Handler,
  UpdateShipmentDetailAshipHandler,
  UpdateOrderLinesHandler,
  PrepareSuggestionsBillHandler,
  GetServiceHandler,
  CreateFormBillHandler,
  CalculateBillFeeHandler,
  PreparePartnerHandler,
  PrepareCopyItemHandler,
  OrderBillHandler,
  ChatomniMessageService,
  ChatomniMessageFacade,
  ActivityMatchingService,
  ConversationService,
  SO_ComputeCaclHandler,
  CalculateFeeAshipHandler,
  // prepareEditBillHandler,
  PrepareCopyBill
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
    ModalBatchRefundComponent,
    CrossCheckingStatusComponent,
    ShipCodeDeliveryComponent,
    ShipStatusDeliveryComponent,
    ModalUpdateDeliveryFromExcelComponent,
    ModalManualUpdateDeliveryComponent,
    PaymentJsonBillComponent
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
    TDSSelectModule,
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
    TDSButtonSpitModule,
    TDSConversationsModule,
    UploadImageModule,
    TDSInputNumberModule,
    TDSTimelineModule,
    DirectivesModule
  ],
  providers: [
   ...SERVICES,
  ],
})

export class BillModule {}
