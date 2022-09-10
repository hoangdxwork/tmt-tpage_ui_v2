import { PipeModule } from './../../shared/pipe/pipe.module';
import { MainSharedModule } from './../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSEchartsModule } from 'tds-report';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { ReportConversationsComponent } from './components/report-conversations/report-conversations.component';
import { ReportArticlesComponent } from './components/report-articles/report-articles.component';
import { ReportSalesComponent } from './components/report-sales/report-sales.component';
import { ReportFacebookComponent } from './components/report-facebook/report-facebook.component';
import { ReportStaffsComponent } from './components/report-staffs/report-staffs.component';
import { ReportTagsComponent } from './components/report-tags/report-tags.component';
import { ReportEmptyDataComponent } from './components/report-empty-data/report-empty-data.component';
import { TDSMenuModule } from 'tds-ui/menu';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSTableModule } from 'tds-ui/table';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSEmptyModule } from 'tds-ui/empty';


@NgModule({
  declarations: [
    ReportComponent,
    ReportConversationsComponent,
    ReportArticlesComponent,
    ReportSalesComponent,
    ReportFacebookComponent,
    ReportStaffsComponent,
    ReportTagsComponent,
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
    PipeModule
  ]
})
export class ReportModule { }
