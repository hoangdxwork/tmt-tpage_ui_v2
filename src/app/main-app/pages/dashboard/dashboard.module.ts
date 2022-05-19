import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSCardModule, TDSFlexModule, TDSSelectModule, TDSTabsModule, TDSFormFieldModule, TDSEmptyModule, TDSTableModule } from 'tmt-tang-ui';
import { OverviewComponent } from './components/overview/overview.component';
import { FacebookReportComponent } from './components/facebook-report/facebook-report.component';
import { LabelReportComponent } from './components/label-report/label-report.component';
import { RevenueReportComponent } from './components/revenue-report/revenue-report.component';
import { ChangingRateReportComponent } from './components/changing-rate-report/changing-rate-report.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';
import { StaffReportComponent } from './components/staff-report/staff-report.component';
import { ProductReportComponent } from './components/product-report/product-report.component';
import { ConnectPageReportComponent } from './components/connect-page-report/connect-page-report.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardFacebookReportComponent } from './components/dashboard-facebook-report/dashboard-facebook-report.component';
import { DashboardTagReportComponent } from './components/dashboard-tag-report/dashboard-tag-report.component';
import { DashboardRevenueReportComponent } from './components/dashboard-revenue-report/dashboard-revenue-report.component';
import { DashboardDailyReportComponent } from './components/dashboard-daily-report/dashboard-daily-report.component';
import { DashboardStaffReportComponent } from './components/dashboard-staff-report/dashboard-staff-report.component';
import { DashboardConnectingPageReportComponent } from './components/dashboard-connecting-page-report/dashboard-connecting-page-report.component';
import { DashboardProductReportComponent } from './components/dashboard-product-report/dashboard-product-report.component';
import { DashboardEmptyDataComponent } from './components/dashboard-empty-data/dashboard-empty-data.component';
import { ReportFacebookService } from '../../services/report-facebook.service';
import { SummaryFacade } from '../../services/facades/summary.facede';

const SERVICES = [
  ReportFacebookService,
  SummaryFacade
]

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
    ConnectPageReportComponent,
    DashboardOverviewComponent,
    DashboardFacebookReportComponent,
    DashboardTagReportComponent,
    DashboardRevenueReportComponent,
    DashboardDailyReportComponent,
    DashboardStaffReportComponent,
    DashboardConnectingPageReportComponent,
    DashboardProductReportComponent,
    DashboardEmptyDataComponent
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
    TDSEmptyModule,
    TDSTableModule
  ],
  providers: [ ...SERVICES]
})
export class DashboardModule { }
