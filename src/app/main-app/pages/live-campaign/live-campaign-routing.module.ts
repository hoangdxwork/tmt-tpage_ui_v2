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
    component: AddLiveCampaignComponent
  },
  {
    path: 'edit/:id',
    component: AddLiveCampaignComponent
  },
  {
    path: 'copy/:id',
    component: AddLiveCampaignComponent
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
