import { DetailBillComponent } from './../bill/detail-bill/detail-bill.component';
import { DetailBillPaymentComponent } from './components/detail-bill-payment/detail-bill-payment.component';
import { DetailOrderLiveCampaignComponent } from './components/detail-order-livecampaign/detail-order-livecampaign.component';
import { DetailMessageComponent } from './components/detail-message/detail-message.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { DetailReportComponent } from './components/detail-report/detail-report.component';
import { AddLiveCampaignV2Component } from './components/add-livecampaign-v2/add-livecampaign-v2.component';
import { EditLiveCampaignComponent } from './components/edit-livecampaign/edit-livecampaign.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLiveCampaignComponent } from './components/add-livecampaign/add-livecampaign.component';
import { LiveCampaignDetailComponent } from './components/live-campaign-detail/live-campaign-detail.component';
import { LiveCampaignComponent } from './live-campaign/live-campaign.component';

const routes: Routes = [
  {
    path: '',
    component: LiveCampaignComponent
  },
  {
    path: 'create',
    component: AddLiveCampaignV2Component
  },
  {
    path: 'edit/:id',
    component: EditLiveCampaignComponent
  },
  {
    path: 'copy/:id',
    component: AddLiveCampaignV2Component
  },
  {
    path: 'detail/:id',
    component: LiveCampaignDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveCampaignRoutingModule { }
