import { DefaultOrderComponent } from './default-order/default-order.component';

import { ConfigAddProductComponent } from './create-product/create-product.component';
import { ConfigDecentralizePageComponent } from './config-users/config-decentralize-page/config-decentralize-page.component';
import { ConfigUsersDivideTaskComponent } from './config-users/config-users-divide-task/config-users-divide-task.component';
import { ConfigPrintBillsComponent } from './config-print-bills/config-print-bills.component';
import { ConfigPagesBasicComponent } from './config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigUsersShiftComponent } from './config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesDivideTaskComponent } from './config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigUsersOperationComponent } from './config-users/config-users-operation/config-users-operation.component';
import { ConfigPromotionsComponent } from './config-promotions/config-promotions.component';
import { ConfigActivitiesComponent } from './config-activities/config-activities.component';
import { ConfigProductComponent } from './product/product.component';
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';
import { AutoQuickReplyComponent } from './auto-quick-reply/auto-quick-reply.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';
import { ConfigAddPromotionComponent } from './config-promotions/components/config-add-promotion/config-add-promotion.component';
import { ConfigEditPromotionComponent } from './config-promotions/components/config-edit-promotion/config-edit-promotion.component';
import { ListProductVariantComponent } from './product-variant/product-variant.component';
import { CreateProductVariantComponent } from './create-product-variant/create-product-variant.component';
import { FacebookCartComponent } from './facebook-cart/facebook-cart.component';
import { ListConfigDeliveryComponent } from './config-delivery/list-config-delivery.component';
import { ConfigDeliveryConnectComponent } from './config-delivery/config-delivery-connect/config-delivery-connect.component';
import { ConfigDeliveryUpdateComponent } from './config-delivery/config-delivery-update/config-delivery-update.component';
import { StatusOrderComponent } from './status-order/status-order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sale-order',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ConfigComponent,
    children:[
      {
        path:'sale-order',
        component: SaleOrderComponent
      },
      {
        path:'default-order',
        component: DefaultOrderComponent
      },
      {
        path:'status-order',
        component: StatusOrderComponent
      },
      {
        path:'facebook-cart',
        component: FacebookCartComponent
      },
      {
        path:'conversation-tags',
        component: ConfigConversationTagsComponent
      },
      {
        path:'auto-reply',
        component: AutoQuickReplyComponent
      },
      // {
      //   path:'tpos-printer',
      //   component: ConfigPrintBillsComponent
      // },
      {
        path:'sms-messages',
        component: ConfigSmsMessagesComponent
      },
      {
        path:'product-variant',
        component: ListProductVariantComponent,
      },
      {
        path:'product-variant/create',
        component: CreateProductVariantComponent
      },
      {
        path:'products',
        component: ConfigProductComponent,
      },
      {
        path:'products/create',
        component: ConfigAddProductComponent
      },
      {
        path:'products/edit/:id',
        component: ConfigAddProductComponent
      },
      // {
      //   path:'activities',
      //   component: ConfigActivitiesComponent
      // },
      {
        path:'promotions',
        component: ConfigPromotionsComponent,
      },
      {
        path:'promotions/create',
        component: ConfigAddPromotionComponent
      },
      {
        path:'promotions/edit/:id',
        component: ConfigEditPromotionComponent
      },
      {
        path:'users',
        children:[
          {
            path:'operation',
            component: ConfigUsersOperationComponent
          },
          {
            path:'divide-task',
            component: ConfigUsersDivideTaskComponent
          },
          {
            path:'shift',
            component: ConfigUsersShiftComponent
          },
          {
            path:'decentralize',
            component: ConfigDecentralizePageComponent
          }
        ]
      },
      {
        path:'pages',
        children:[
          {
            path:'basic',
            component: ConfigPagesBasicComponent
          },
          {
            path:'divide-task',
            component: ConfigPagesDivideTaskComponent
          }
        ]
      },
      {
        path:'delivery',
        component: ListConfigDeliveryComponent,
      },
      {
        path: 'delivery/connect',
        component: ConfigDeliveryConnectComponent,
      },
      {
        path: 'delivery/edit',
        component: ConfigDeliveryUpdateComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigsRoutingModule { }
