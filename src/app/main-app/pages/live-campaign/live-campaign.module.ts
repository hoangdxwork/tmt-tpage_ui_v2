import { ModalMergeOrderComponent } from './components/detail-bill/modal-merge-order.component';
import { TDSImageModule } from 'tds-ui/image';
import { PrepareAddCampaignHandler } from './../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { DirectivesModule } from './../../shared/directives/directives.module';
import { ConversationService } from './../../services/conversation/conversation.service';
import { ActivityMatchingService } from './../../services/conversation/activity-matching.service';
import { ChatomniMessageFacade } from './../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniMessageService } from '@app/services/chatomni-service/chatomni-message.service';
import { ConversationOrderFacade } from './../../services/facades/conversation-order.facade';
import { TDSMessageService } from 'tds-ui/message';
import { ConversationEventFacade } from './../../services/facades/conversation-event.facade';
import { ConversationDataFacade } from './../../services/facades/conversation-data.facade';
import { ActivityDataFacade } from './../../services/facades/activity-data.facade';
import { CRMMatchingService } from './../../services/crm-matching.service';
import { TDSConversationsModule } from './../../shared/tds-conversations/tds-conversations.module';
import { OdataGetOrderPartnerIdService } from 'src/app/main-app/services/mock-odata/odata-getorder-partnerid.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveCampaignRoutingModule } from './live-campaign-routing.module';
import { MainSharedModule } from '../../shared/shared.module';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { QuickReplyService } from '../../services/quick-reply.service';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { ApplicationUserService } from '../../services/application-user.service';
import { LiveCampaignComponent } from './live-campaign/live-campaign.component';
import { LiveCampaignListComponent } from './components/live-campaign-list/live-campaign-list.component';
import { ExpandLiveCampaignComponent } from './components/expand-live-campaign/expand-live-campaign.component';
import { LiveCampaignDetailComponent } from './components/live-campaign-detail/live-campaign-detail.component';
import { ConfigColumnComponent } from './components/config-column/config-column.component';
import { DetailReportComponent } from './components/detail-report/detail-report.component';
import { ModalLiveCampaignOrderComponent } from './components/modal-live-campaign-order/modal-live-campaign-order.component';
import { ModalLiveCampaignBillComponent } from './components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalInfoOrderComponent } from './components/modal-info-order/modal-info-order.component';
import { DetailMessageComponent } from './components/detail-message/detail-message.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { DetailOrderLiveCampaignComponent } from './components/detail-order-livecampaign/detail-order-livecampaign.component';
import { DetailBillPaymentComponent } from './components/detail-bill-payment/detail-bill-payment.component';
import { DetailBillComponent } from './components/detail-bill/detail-bill.component';
import { TableOrderMessageComponent } from './components/table-order-message/table-order-message.component';
import { TableBillMessageComponent } from './components/table-bill-message/table-bill-message.component';
import { ModalInfoBillComponent } from './components/modal-info-bill/modal-info-bill.component';
import { TagService } from '../../services/tag.service';
import { ODataLiveCampaignOrderService } from '../../services/mock-odata/odata-live-campaign-order.service';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { PartnerService } from '../../services/partner.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { ODataLiveCampaignBillService } from '../../services/mock-odata/odata-live-campaign-bill.service';
import { TableOrderWaitComponent } from './components/table-order-wait/table-order-wait.component';
import { TableOrderCancelComponent } from './components/table-order-cancel/table-order-cancel.component';
import { TableBillConfirmedComponent } from './components/table-bill-confirmed/table-bill-confirmed.component';
import { TableBillCancelComponent } from './components/table-bill-cancel/table-bill-cancel.component';
import { ModalHistoryCartComponent } from './components/modal-history-cart/modal-history-cart.component';
import { ModalConfirmedDepositComponent } from './components/modal-confirmed-deposit/modal-confirmed-deposit.component';
import { ModalPaymentComponent } from './components/modal-payment/modal-payment.component';
import { AccountJournalService } from '../../services/account-journal.service';
import { AccountRegisterPaymentService } from '../../services/account-register-payment.service';
import { DrawerOrderMessageComponent } from './components/drawer-order-message/drawer-order-message.component';
import { TDSAutocompleteModule } from 'tds-ui/auto-complete';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSPageHeaderModule } from 'tds-ui/page-header';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSwitchModule } from 'tds-ui/switch';
import { ODataLiveCampaignService } from '../../services/mock-odata/odata-live-campaign.service';
import { FilterOptionCampaignComponent } from './components/filter-option-campaign/filter-option-campaign.component';
import { CommonHandler } from '../../handler-v2/common.handler';
import { ExpandOrderLivecampaignComponent } from './components/expand-order-livecampaign/expand-order-livecampaign.component';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { OrderModule } from '../order/order.module';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { DrawerBillMessageComponent } from './components/drawer-bill-message/drawer-bill-message.component';
import { TDSBadgeModule } from 'tds-ui/badges';
import { EditLiveCampaignComponent } from './components/edit-livecampaign/edit-livecampaign.component';
import { AddLiveCampaignV2Component } from './components/add-livecampaign-v2/add-livecampaign-v2.component';
import { TableAllOrderComponent } from './components/table-all-order/table-all-order.component';
import { TableDeletedOrderComponent } from './components/table-deleted-order/table-deleted-order.component';
import { ImportProductLivecampaignComponent } from './components/import-product-livecampaign/import-product-livecampaign.component';
import { GenerateTagAttributesFacade } from '@app/services/facades/generate-tag-attributes.facade';
import { TDSCarouselModule } from 'tds-ui/carousel';

const cmp =[
  LiveCampaignComponent,
  LiveCampaignListComponent,
  ExpandLiveCampaignComponent,
  LiveCampaignDetailComponent,
  ConfigColumnComponent,
  DetailReportComponent,
  ModalLiveCampaignOrderComponent,
  ModalLiveCampaignBillComponent,
  ModalInfoOrderComponent,
  DetailMessageComponent,
  DetailProductComponent,
  DetailOrderLiveCampaignComponent,
  DetailBillPaymentComponent,
  DetailBillComponent,
  TableOrderMessageComponent,
  TableBillMessageComponent,
  ModalInfoBillComponent,
  TableOrderWaitComponent,
  TableOrderCancelComponent,
  TableBillConfirmedComponent,
  TableBillCancelComponent,
  ModalHistoryCartComponent,
  ModalConfirmedDepositComponent,
  ModalPaymentComponent,
  DrawerOrderMessageComponent,
  DrawerBillMessageComponent,
  FilterOptionCampaignComponent,
  ExpandOrderLivecampaignComponent,
  EditLiveCampaignComponent,
  AddLiveCampaignV2Component,
  ImportProductLivecampaignComponent,
  TableAllOrderComponent,
  TableDeletedOrderComponent,
  ModalMergeOrderComponent
]

const SERVICES = [
  CommonService,
  QuickReplyService,
  LiveCampaignService,
  FastSaleOrderLineService,
  ApplicationUserService,
  CommonHandler,
  TagService,
  ODataLiveCampaignOrderService,
  FastSaleOrderService,
  PartnerService,
  OdataProductService,
  ODataLiveCampaignBillService,
  AccountJournalService,
  AccountRegisterPaymentService,
  ODataLiveCampaignService,
  PrinterService,
  OrderPrintService,
  OdataGetOrderPartnerIdService,
  CRMMatchingService,
  TDSMessageService,
  ActivityDataFacade,
  ConversationDataFacade,
  ConversationEventFacade,
  ConversationOrderFacade,
  ChatomniMessageService,
  ChatomniMessageFacade,
  ActivityMatchingService,
  ConversationService,
  ChatomniCommentFacade,
  ChatomniConversationFacade,
  PrepareAddCampaignHandler
]

const FACADE = [
  GenerateTagAttributesFacade
]

@NgModule({
  declarations: [
    ...cmp,
  ],
  imports: [
    CommonModule,
    LiveCampaignRoutingModule,
    TDSPageHeaderModule,
    TDSButtonModule,
    TDSButtonMenuModule,
    TDSBreadCrumbModule,
    TDSDropDownModule,
    TDSAutocompleteModule,
    TDSInputModule,
    TDSFormFieldModule,
    TDSTableModule,
    TDSTabsModule,
    TDSSwitchModule,
    TDSTypographyModule,
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    ReactiveFormsModule,
    TDSSpinnerModule,
    TDSInputNumberModule,
    TDSCollapseModule,
    TDSSelectModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSAvatarModule,
    TDSTagModule,
    TDSBadgeModule,
    TDSToolTipModule,
    TDSPopoverModule,
    TDSModalModule,
    TDSFilterStatusModule,
    TDSTimelineModule,
    TDSDrawerModule,
    TDSConversationsModule,
    OrderModule,
    DirectivesModule,
    TDSImageModule,
    TDSCarouselModule
  ],
  providers: [
    ...SERVICES,
    ...FACADE
  ]
})

export class LiveCampaignModule { }
