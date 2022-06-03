import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveCampaignListComponent } from './live-campaign-list/live-campaign-list.component';

const routes: Routes = [
  {
    path: '',
    component: LiveCampaignListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveCampaigntRoutingModule { }
