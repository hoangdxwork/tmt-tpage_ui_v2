import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TDSButtonModule, TDSModalService } from "tmt-tang-ui";
import { CommonService } from "../../services/common.service";
import { PipeModule } from "../../shared/pipe/pipe.module";
import { MainSharedModule } from "../../shared/shared.module";
import { LiveCampaignRoutingModule } from "./livecampaign-routing.module";
import { LiveCampaignComponent } from "./livecampaign/livecampaign.component";
import { UpdateLivecampaignComponent } from './components/update-livecampaign/update-livecampaign.component';
import { DetailLivecampaignComponent } from './components/detail-livecampaign/detail-livecampaign.component';

const cmp =[
  LiveCampaignComponent
]

const SERVICES = [
  TDSModalService,
  CommonService,
]

@NgModule({
  declarations: [
    ...cmp,
    UpdateLivecampaignComponent,
    DetailLivecampaignComponent
  ],
  imports: [
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    LiveCampaignRoutingModule,
    ReactiveFormsModule,
    TDSButtonModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class LiveCampaignModule { }
