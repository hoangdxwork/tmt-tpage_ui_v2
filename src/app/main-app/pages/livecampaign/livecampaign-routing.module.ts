import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLiveCampaignComponent } from './components/add-livecampaign/add-livecampaign.component';
import { LiveCampaignComponent } from './livecampaign/livecampaign.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveCampaignRoutingModule { }
