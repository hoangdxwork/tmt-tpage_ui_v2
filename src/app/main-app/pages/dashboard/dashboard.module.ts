import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSCardModule, TDSFlexModule, TDSSelectModule, TDSTabsModule, TDSFormFieldModule, TDSEmptyModule } from 'tmt-tang-ui';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TDSTabsModule,
    TDSFlexModule,
    TDSCardModule,
    TDSAvatarModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSEmptyModule
  ]
})
export class DashboardModule { }
