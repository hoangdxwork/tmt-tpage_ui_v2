import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDatePickerModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSModalService, TDSPageHeaderModule, TDSPopoverModule, TDSSelectModule, TDSSpinnerModule, TDSSwitchModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSTimelineModule, TDSToolTipModule, TDSTypographyModule } from 'tmt-tang-ui';
import { LiveCampaignRoutingModule } from './live-campaign-routing.module';
import { MainSharedModule } from '../../shared/shared.module';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { QuickReplyService } from '../../services/quick-reply.service';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { ApplicationUserService } from '../../services/application-user.service';
import { AddLiveCampaignComponent } from './components/add-livecampaign/add-livecampaign.component';
import { LiveCampaignComponent } from './live-campaign/live-campaign.component';
import { SummaryFacade } from '../../services/facades/summary.facede';
import { LiveCampaignListComponent } from './components/live-campaign-list/live-campaign-list.component';
import { LiveCampaignDebtComponent } from './components/live-campaign-debt/live-campaign-debt.component';
import { LiveCampaignDetailComponent } from './components/live-campaign-detail/live-campaign-detail.component';
import { ConfigColumnComponent } from './components/config-column/config-column.component';
import { DetailReportComponent } from './components/detail-report/detail-report.component';
import { ModalLiveCampaignOrderComponent } from './components/modal-live-campaign-order/modal-live-campaign-order.component';
import { ModalLiveCampaignBillComponent } from './components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalInfoOrderComponent } from './components/modal-info-order/modal-info-order.component';
import { DetailMessageComponent } from './components/detail-message/detail-message.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { DetailOrderComponent } from './components/detail-order/detail-order.component';
import { DetailBillPaymentComponent } from './components/detail-bill-payment/detail-bill-payment.component';
import { DetailBillComponent } from './components/detail-bill/detail-bill.component';
import { TableOrderMessageComponent } from './components/table-order-message/table-order-message.component';
import { TableBillMessageComponent } from './components/table-bill-message/table-bill-message.component';
import { ModalInfoBillComponent } from './components/modal-info-bill/modal-info-bill.component';
import { TagService } from '../../services/tag.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { ODataLiveCampaignOrderService } from '../../services/mock-odata/odata-live-campaign-order.service';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { CarrierHandler } from '../../services/handlers/carier.handler';
import { PartnerService } from '../../services/partner.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { CheckFormHandler } from '../../services/handlers/check-form.handler';
import { ODataLiveCampaignBillService } from '../../services/mock-odata/odata-live-campaign-bill.service';
import { TableOrderWaitComponent } from './components/table-order-wait/table-order-wait.component';
import { TableOrderCancelComponent } from './components/table-order-cancel/table-order-cancel.component';
import { TableBillConfirmedComponent } from './components/table-bill-confirmed/table-bill-confirmed.component';
import { TableBillCancelComponent } from './components/table-bill-cancel/table-bill-cancel.component';
import { ModalHistoryCartComponent } from './components/modal-history-cart/modal-history-cart.component';

const cmp =[
  AddLiveCampaignComponent,
  LiveCampaignComponent,
  LiveCampaignListComponent,
  LiveCampaignDebtComponent,
  LiveCampaignDetailComponent,
  ConfigColumnComponent,
  DetailReportComponent,
  ModalLiveCampaignOrderComponent,
  ModalLiveCampaignBillComponent,
  ModalInfoOrderComponent,
  DetailMessageComponent,
  DetailProductComponent,
  DetailOrderComponent,
  DetailBillPaymentComponent,
  DetailBillComponent,
  TableOrderMessageComponent,
  TableBillMessageComponent,
  ModalInfoBillComponent,
  TableOrderWaitComponent,
  TableOrderCancelComponent,
  TableBillConfirmedComponent,
  TableBillCancelComponent,
  ModalHistoryCartComponent
]

const SERVICES = [
  TDSModalService,
  CommonService,
  QuickReplyService,
  LiveCampaignService,
  FastSaleOrderLineService,
  ApplicationUserService,
  SummaryFacade,
  TagService,
  DeliveryCarrierService,
  ODataLiveCampaignOrderService,
  FastSaleOrderService,
  CarrierHandler,
  PartnerService,
  OdataProductService,
  CheckFormHandler,
  ODataLiveCampaignBillService
]

@NgModule({
  declarations: [
    ...cmp
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
    TDSToolTipModule,
    TDSPopoverModule,
    TDSModalModule,
    TDSFilterStatusModule,
    TDSTimelineModule
  ],
  providers: [
    ...SERVICES
  ]
})
export class LiveCampaignModule { }
