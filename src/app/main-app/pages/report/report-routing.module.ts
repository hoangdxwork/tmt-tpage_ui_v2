import { ReportLabelsComponent } from './components/report-labels/report-labels.component';
import { ReportStaffsComponent } from './components/report-staffs/report-staffs.component';
import { ReportFacebookComponent } from './components/report-facebook/report-facebook.component';
import { ReportSalesComponent } from './components/report-sales/report-sales.component';
import { ReportArticlesComponent } from './components/report-articles/report-articles.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportConversationsComponent } from './components/report-conversations/report-conversations.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'conversations',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ReportComponent,
    children:[
      {
        path: 'conversations',
        component: ReportConversationsComponent,
      },
      {
        path: 'articles',
        component: ReportArticlesComponent,
      },
      {
        path: 'sales',
        component: ReportSalesComponent,
      },
      {
        path: 'facebook',
        component: ReportFacebookComponent,
      },
      {
        path: 'staffs',
        component: ReportStaffsComponent,
      },
      {
        path: 'labels',
        component: ReportLabelsComponent,
      },
    ]
  },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
