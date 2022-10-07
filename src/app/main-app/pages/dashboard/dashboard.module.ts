import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSTagModule } from 'tds-ui/tag';
import { EventSummaryService } from './../../services/event-summary.service';
import { PipeModule } from './../../shared/pipe/pipe.module';
import { UploadImageModule } from './../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TDSEchartsModule } from 'tds-report';
import { FacebookReportComponent } from './components/facebook-report/facebook-report.component';
import { LabelReportComponent } from './components/label-report/label-report.component';
import { RevenueReportComponent } from './components/revenue-report/revenue-report.component';
import { ChangingRateReportComponent } from './components/changing-rate-report/changing-rate-report.component';
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
import { CRMMatchingService } from '../../services/crm-matching.service';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSFlexModule } from 'tds-ui/flex';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSCardModule } from 'tds-ui/card';
import { TDSTableModule } from 'tds-ui/table';
import { TDSEmptyModule } from 'tds-ui/empty';
import { CommonHandler } from '../../handler-v2/common.handler';

const SERVICES = [
  ReportFacebookService,
  CRMMatchingService,
  CommonHandler,
  EventSummaryService
]

@NgModule({
  declarations: [
    DashboardComponent,
    FacebookReportComponent,
    LabelReportComponent,
    RevenueReportComponent,
    ChangingRateReportComponent,
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
    TDSTableModule,
    TDSSpinnerModule,
    UploadImageModule,
    PipeModule,
    TDSTagModule, 
    TDSToolTipModule
  ],
  providers: [ ...SERVICES]
})
export class DashboardModule { }
