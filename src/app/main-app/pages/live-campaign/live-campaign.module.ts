import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDatePickerModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSModalService, TDSPageHeaderModule, TDSPopoverModule, TDSSelectModule, TDSSpinnerModule, TDSSwitchModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSToolTipModule, TDSTypographyModule } from 'tmt-tang-ui';
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

const cmp =[
  AddLiveCampaignComponent,
  LiveCampaignComponent,
  LiveCampaignListComponent,
  LiveCampaignDebtComponent,
  LiveCampaignDetailComponent,
  ConfigColumnComponent
]

const SERVICES = [
  TDSModalService,
  CommonService,
  QuickReplyService,
  LiveCampaignService,
  FastSaleOrderLineService,
  ApplicationUserService,
  SummaryFacade
]

@NgModule({
  declarations: [
    ...cmp,
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
    TableBillMessageComponent
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
    TDSFilterStatusModule
  ],
  providers: [
    ...SERVICES
  ]
})
export class LiveCampaignModule { }
