import { MainSharedModule } from './../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSDatePickerModule, TDSMenuModule, TDSSelectModule, TDSTableModule, TDSButtonModule, TDSCollapseModule, TDSDropDownModule, TDSModalModule, TDSBadgeModule, TDSFormFieldModule, TDSEmptyModule } from 'tmt-tang-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { ReportConversationsComponent } from './components/report-conversations/report-conversations.component';
import { ReportArticlesComponent } from './components/report-articles/report-articles.component';
import { ReportSalesComponent } from './components/report-sales/report-sales.component';
import { ReportFacebookComponent } from './components/report-facebook/report-facebook.component';
import { ReportStaffsComponent } from './components/report-staffs/report-staffs.component';
import { ReportLabelsComponent } from './components/report-labels/report-labels.component';
import { ReportEmptyDataComponent } from './components/report-empty-data/report-empty-data.component';


@NgModule({
  declarations: [
    ReportComponent,
    ReportConversationsComponent,
    ReportArticlesComponent,
    ReportSalesComponent,
    ReportFacebookComponent,
    ReportStaffsComponent,
    ReportLabelsComponent,
    ReportEmptyDataComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    MainSharedModule,
    TDSMenuModule,
    TDSAvatarModule,
    TDSSelectModule,
    TDSTableModule,
    TDSDatePickerModule,
    TDSButtonModule,
    TDSCollapseModule,
    TDSDropDownModule,
    TDSModalModule,
    TDSBadgeModule,
    TDSFormFieldModule,
    TDSEmptyModule,
  ]
})
export class ReportModule { }
