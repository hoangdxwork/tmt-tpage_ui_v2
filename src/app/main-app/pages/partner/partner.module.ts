import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner/partner.component';


@NgModule({
  declarations: [
    PartnerComponent
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule
  ]
})
export class PartnerModule { }
