import { PackOfDataComponent } from './pack-of-data/pack-of-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSEchartsModule } from 'tds-report';
import { TDSCardModule, TDSError, TDSInputModule, TDSFormFieldModule, TDSSelectModule, TDSButtonModule } from 'tmt-tang-ui';
import { InfoPaymentPackOfDataComponent } from './info-payment-pack-of-data/info-payment-pack-of-data.component';
import { ExtendPackOfDataComponent } from './extend-pack-of-data/extend-pack-of-data.component';
import { ChoosePackOfDataComponent } from './choose-pack-of-data/choose-pack-of-data.component';
import { InfoPackOfDataComponent } from './info-pack-of-data/info-pack-of-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackOfDataRoutingModule } from './pack-of-data-routing.module';


@NgModule({
  declarations: [
    PackOfDataComponent,
    InfoPackOfDataComponent,
    ChoosePackOfDataComponent,
    ExtendPackOfDataComponent,
    InfoPaymentPackOfDataComponent,
  ],
  imports: [
    CommonModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    PackOfDataRoutingModule,
    TDSCardModule,
    TDSInputModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TDSButtonModule
  ]
})
export class PackOfDataModule { }
