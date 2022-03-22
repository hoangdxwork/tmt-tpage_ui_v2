import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSDatePickerModule, TDSMenuModule, TDSSelectModule, TDSTableModule, TDSButtonModule } from 'tmt-tang-ui';
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


@NgModule({
  declarations: [
    ReportComponent,
    ReportConversationsComponent,
    ReportArticlesComponent,
    ReportSalesComponent,
    ReportFacebookComponent,
    ReportStaffsComponent,
    ReportLabelsComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TDSMenuModule,
    TDSAvatarModule,
    TDSSelectModule,
    TDSTableModule,
    TDSDatePickerModule,
    TDSButtonModule
  ]
})
export class ReportModule { }
