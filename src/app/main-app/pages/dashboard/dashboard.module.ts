import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSCardModule, TDSFlexModule, TDSSelectModule, TDSTabsModule, TDSFormFieldModule, TDSEmptyModule } from 'tmt-tang-ui';
import { OverviewComponent } from './components/overview/overview.component';
import { FacebookReportComponent } from './components/facebook-report/facebook-report.component';
import { LabelReportComponent } from './components/label-report/label-report.component';
import { RevenueReportComponent } from './components/revenue-report/revenue-report.component';
import { ChangingRateReportComponent } from './components/changing-rate-report/changing-rate-report.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';
import { StaffReportComponent } from './components/staff-report/staff-report.component';
import { ProductReportComponent } from './components/product-report/product-report.component';
import { ConnectPageReportComponent } from './components/connect-page-report/connect-page-report.component';


@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    FacebookReportComponent,
    LabelReportComponent,
    RevenueReportComponent,
    ChangingRateReportComponent,
    DailyReportComponent,
    StaffReportComponent,
    ProductReportComponent,
    ConnectPageReportComponent
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
