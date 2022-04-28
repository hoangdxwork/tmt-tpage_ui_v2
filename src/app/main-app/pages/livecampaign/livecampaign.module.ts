import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TDSModalService } from "tmt-tang-ui";
import { CommonService } from "../../services/common.service";
import { PipeModule } from "../../shared/pipe/pipe.module";
import { MainSharedModule } from "../../shared/shared.module";
import { LiveCampaignRoutingModule } from "./livecampaign-routing.module";
import { LiveCampaignComponent } from "./livecampaign/livecampaign.component";

const SERVICES = [
  TDSModalService,
  CommonService,
]

@NgModule({
  declarations: [
    LiveCampaignComponent,
  ],
  imports: [
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    LiveCampaignRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class LiveCampaignModule { }
