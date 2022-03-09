import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TAuthGuardService } from '../lib';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [TAuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: "dashboard",
        data: {
          breadcrumb: 'Dashboard'
        },
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: "conversation",
        data: {
          breadcrumb: 'Conversation'
        },
        loadChildren: () => import('./pages/conversations/conversations.module').then(m => m.ConversationsModule)
      },
      {
        path: "order",
        data: {
          breadcrumb: 'Order'
        },
        loadChildren: () => import('./pages/order/order.module').then(m => m.OrderModule)
      },
      {
        path: "bill",
        data: {
          breadcrumb: 'Order'
        },
        loadChildren: () => import('./pages/bill/bill.module').then(m => m.BillModule)
      },
      {
        path: "configs",
        data: {
          breadcrumb: 'Config'
        },
        loadChildren: () => import('./pages/configs/configs.module').then(m => m.ConfigsModule)
      },
      {
        path: "report",
        data: {
          breadcrumb: 'Report'
        },
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule)
      },
      {
        path: "partner",
        data: {
          breadcrumb: 'Partner'
        },
        loadChildren: () => import('./pages/partner/partner.module').then(m => m.PartnerModule)
      },
      {
        path: "facebook",
        data: {
          breadcrumb: 'Partner'
        },
        loadChildren: () => import('./pages/facebook/facebook.module').then(m => m.FacebookModule)
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
