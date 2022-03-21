import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSEchartsModule } from 'tds-report';
import { TDSAvatarModule, TDSDatePickerModule, TDSSelectModule, TDSTableModule } from 'tmt-tang-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { SalesComponent } from './components/sales/sales.component';


@NgModule({
  declarations: [
    ReportComponent,
    ConversationsComponent,
    ArticlesComponent,
    SalesComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TDSAvatarModule,
    TDSSelectModule,
    TDSTableModule,
    TDSDatePickerModule
  ]
})
export class ReportModule { }
