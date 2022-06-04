import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TDSAvatarModule, TDSBreadCrumbModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDatePickerModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSModalService, TDSPopoverModule, TDSSelectModule, TDSSpinnerModule, TDSSwitchModule, TDSTableModule, TDSTagModule, TDSToolTipModule } from "tmt-tang-ui";
import { CommonService } from "../../services/common.service";
import { PipeModule } from "../../shared/pipe/pipe.module";
import { MainSharedModule } from "../../shared/shared.module";
import { LiveCampaignRoutingModule } from "./livecampaign-routing.module";
import { LiveCampaignComponent } from "./livecampaign/livecampaign.component";
import { DetailLivecampaignComponent } from './components/detail-livecampaign/detail-livecampaign.component';
import { AddLiveCampaignComponent } from "./components/add-livecampaign/add-livecampaign.component";
import { QuickReplyService } from "../../services/quick-reply.service";
import { LiveCampaignService } from "../../services/live-campaign.service";
import { FastSaleOrderLineService } from "../../services/fast-sale-orderline.service";
import { ApplicationUserService } from "../../services/application-user.service";

const cmp =[
  LiveCampaignComponent,
  DetailLivecampaignComponent,
  AddLiveCampaignComponent
]

const SERVICES = [
  TDSModalService,
  CommonService,
  QuickReplyService,
  LiveCampaignService,
  FastSaleOrderLineService,
  ApplicationUserService
]

@NgModule({
  declarations: [
    ...cmp
  ],
  imports: [
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    LiveCampaignRoutingModule,
    ReactiveFormsModule,
    TDSButtonModule,
    TDSSpinnerModule,
    TDSBreadCrumbModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSInputNumberModule,
    TDSCollapseModule,
    TDSSelectModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSTableModule,
    TDSAvatarModule,
    TDSSwitchModule,
    TDSTagModule,
    TDSToolTipModule,
    TDSPopoverModule,
    TDSModalModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class LiveCampaignModule { }
