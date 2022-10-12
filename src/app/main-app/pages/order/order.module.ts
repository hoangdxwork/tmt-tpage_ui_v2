import { ChatomniConversationFacade } from './../../services/chatomni-facade/chatomni-conversation.facade';
import { ConversationService } from './../../services/conversation/conversation.service';
import { ActivityMatchingService } from './../../services/conversation/activity-matching.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { TDSEmptyModule } from 'tds-ui/empty';
import { DirectivesModule } from './../../shared/directives/directives.module';
import { AttachmentState } from './../../services/facebook-state/attachment.state';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentDataFacade } from './../../services/facades/attachment-data.facade';
import { ConversationOrderFacade } from './../../services/facades/conversation-order.facade';
import { ConversationEventFacade } from './../../services/facades/conversation-event.facade';
import { ConversationDataFacade } from './../../services/facades/conversation-data.facade';
import { ActivityDataFacade } from './../../services/facades/activity-data.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSConversationsModule } from './../../shared/tds-conversations/tds-conversations.module';
import { UploadImageModule } from './../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { CRMMatchingService } from './../../services/crm-matching.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';
import { OdataSaleOnline_OrderService } from '../../services/mock-odata/odata-saleonlineorder.service';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { ConfigColumnComponent } from './components/config-column/config-column.component';
import { UpdateStatusOrderComponent } from './components/update-status-order/update-status-order.component';
import { MainSharedModule } from '../../shared/shared.module';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { TagService } from '../../services/tag.service';
import { DuplicateUserComponent } from './components/duplicate-user/duplicate-user.component';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { CreateBillFastComponent } from './components/create-bill-fast/create-bill-fast.component';
import { CreateBillErrorComponent } from './components/create-bill-error/create-bill-error.component';
import { CreateBillDefaultComponent } from './components/create-bill-default/create-bill-default.component';
import { InfoPartnerComponent } from './components/info-partner/info-partner.component';
import { PartnerService } from '../../services/partner.service';
import { UpdateInfoPartnerComponent } from './components/update-info-partner/update-info-partner.component';
import { PrinterService } from '../../services/printer.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSTableModule } from 'tds-ui/table';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { OrderPrintService } from '../../services/print/order-print.service';
import { ExpandOrderDetailComponent } from './components/expand-order/expand-order-detail.component';
import { TDSNotificationModule } from "tds-ui/notification";
import { ModalHistoryChatComponent } from './components/modal-history-chat/modal-history-chat.component';
import { OdataGetOrderPartnerIdService } from '../../services/mock-odata/odata-getorder-partnerid.service';
import { LiveOrderByPartnerComponent } from './components/live-order-bypartner/live-order-bypartner.component';
import { OverviewOrderBypartnerComponent } from './components/overview-order-bypartner/overview-order-bypartner.component';
import { OdataFastSaleOrderPartnerIdService } from '../../services/mock-odata/odata-fastsaleorder-partnerid.service';
import { PrepareModelFeeV2Handler } from '../../handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from '../../handler-v2/aship-v2/select-shipservice-v2.handler';
import { UpdateShipExtraHandler } from '../../handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from '../../handler-v2/aship-v2/update-shipservice-extras.handler';
import { UpdateShipmentDetailAshipHandler } from '../../handler-v2/aship-v2/shipment-detail-aship.handler';
import { EditOrderV2Component } from './components/edit-order/edit-order-v2.component';
import { SO_ComputeCaclHandler } from '../../handler-v2/order-handler/compute-cacl.handler';
import { CalculateFeeAshipHandler } from '../../handler-v2/aship-v2/calcfee-aship.handler';
import { CsOrder_SuggestionHandler } from '@app/handler-v2/chatomni-csorder/prepare-suggestions.handler';
import { ConvertCustomersComponent } from './components/convert-customers/convert-customers.component';
import { ChatomniMessageService } from '@app/services/chatomni-service/chatomni-message.service';
import { SO_PrepareFastSaleOrderHandler } from '@app/handler-v2/order-handler/prepare-fastsaleorder.handler';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { LiveCampaignService } from '@app/services/live-campaign.service';

const SERVICES = [
  OdataSaleOnline_OrderService,
  SaleOnline_OrderService,
  TagService,
  DeliveryCarrierService,
  CommonService,
  FastSaleOrderService,
  PartnerService,
  PrinterService,
  ExcelExportService,
  OdataProductService,
  OrderPrintService,
  CRMMatchingService,
  TDSMessageService,
  ActivityDataFacade,
  ConversationDataFacade,
  ConversationEventFacade,
  ConversationOrderFacade,
  AttachmentDataFacade,
  AttachmentService,
  AttachmentState,
  OdataGetOrderPartnerIdService,
  OdataFastSaleOrderPartnerIdService,
  PrepareModelFeeV2Handler,
  SelectShipServiceV2Handler,
  UpdateShipExtraHandler,
  UpdateShipServiceExtrasHandler,
  UpdateShipmentDetailAshipHandler,
  SO_ComputeCaclHandler,
  CalculateFeeAshipHandler,
  CsOrder_SuggestionHandler,
  ChatomniMessageService,
  ChatomniMessageFacade,
  LiveCampaignService,
  ActivityMatchingService,
  ConversationService,
  SO_PrepareFastSaleOrderHandler,
  ChatomniCommentFacade,
  ChatomniConversationFacade
]

@NgModule({
  declarations: [
    OrderComponent,
    ActionDropdownComponent,
    FilterOptionsComponent,
    ConfigColumnComponent,
    UpdateStatusOrderComponent,
    DuplicateUserComponent,
    CreateBillFastComponent,
    CreateBillErrorComponent,
    CreateBillDefaultComponent,
    ExpandOrderDetailComponent,
    InfoPartnerComponent,
    UpdateInfoPartnerComponent,
    ModalHistoryChatComponent,
    LiveOrderByPartnerComponent,
    OverviewOrderBypartnerComponent,
    EditOrderV2Component,
    ConvertCustomersComponent
  ],
  imports: [
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    TDSTabsModule,
    TDSTableModule,
    TDSTagModule,
    TDSBadgeModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSButtonModule,
    TDSDropDownModule,
    TDSPopoverModule,
    TDSFilterStatusModule,
    TDSSpinnerModule,
    TDSInputNumberModule,
    TDSInputModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSModalModule,
    TDSAvatarModule,
    TDSCollapseModule,
    TDSToolTipModule,
    TDSDrawerModule,
    UploadImageModule,
    TDSConversationsModule,
    TDSNotificationModule,
    DirectivesModule,
    TDSEmptyModule
  ],
  exports: [
    EditOrderV2Component,
    FilterOptionsComponent
  ],
  providers: [
    ...SERVICES,
  ],
})
export class OrderModule { }
