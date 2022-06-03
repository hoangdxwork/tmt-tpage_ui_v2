import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateLivecampaignComponent } from './components/update-livecampaign/update-livecampaign.component';
import { LiveCampaignComponent } from './livecampaign/livecampaign.component';

const routes: Routes = [
  {
    path: '',
    component: LiveCampaignComponent
  },
  {
    path: 'create',
    component: UpdateLivecampaignComponent
  },
  {
    path: 'edit/:id',
    component: UpdateLivecampaignComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveCampaignRoutingModule { }
