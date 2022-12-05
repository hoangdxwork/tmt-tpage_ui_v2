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
          breadcrumb: 'Conversation',
          collapse: true
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
        path: "live-campaign",
        data: {
          breadcrumb: 'Live Campaign'
        },
        loadChildren: () => import('./pages/live-campaign/live-campaign.module').then(m => m.LiveCampaignModule)
      },
      {
        path: "bill",
        data: {
          breadcrumb: 'Order'
        },
        loadChildren: () => import('./pages/bill/bill.module').then(m => m.BillModule)
      },
      {
        path: "chatbot",
        data: {
          breadcrumb: 'Chatbot'
        },
        loadChildren: () => import('./pages/chatbot/chatbot.module').then(m => m.ChatbotModule)
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
        path: "connect-channel",
        data: {
          breadcrumb: 'Partner'
        },
        loadChildren: () => import('./pages/facebook/facebook.module').then(m => m.FacebookModule)
      },
      {
        path: "user",
        data: {
          breadcrumb: 'User'
        },
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
      },
      {
        path: "omni-connection",
        loadChildren: () => import('omnichannel/modules/connections').then(m => m.ConnectionModule)
      },
      {
        path: "omni-product",
        loadChildren: () => import('omnichannel/modules/products').then(m => m.ProductModule)
      },
      {
        path: "omni-order",
        loadChildren: () => import('omnichannel/modules/orders').then(m => m.OrderModule)
      },
      {
        path: "omni-product-tpos",
        loadChildren: () => import('omnichannel/modules/product-tpos').then(m => m.ProductTposModule)
      },
      {
        path:  "*",
        redirectTo: '/dashboard',
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
