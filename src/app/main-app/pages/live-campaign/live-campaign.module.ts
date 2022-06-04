import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveCampaigntRoutingModule } from './live-campaign-routing.module';
import { TDSAutocompleteModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSPageHeaderModule, TDSSwitchModule, TDSTableModule, TDSTabsModule, TDSTypographyModule } from 'tmt-tang-ui';
import { LiveCampaignListComponent } from './live-campaign-list/live-campaign-list.component';



@NgModule({
  declarations: [
    LiveCampaignListComponent,
  ],
  imports: [
    CommonModule,
    LiveCampaigntRoutingModule,
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
  ]
})
export class LiveCampaignModule { }
