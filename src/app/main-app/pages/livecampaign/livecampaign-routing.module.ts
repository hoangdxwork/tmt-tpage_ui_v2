import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveCampaignComponent } from './livecampaign/livecampaign.component';

const routes: Routes = [
  {
    path: '',
    component: LiveCampaignComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveCampaignRoutingModule { }
