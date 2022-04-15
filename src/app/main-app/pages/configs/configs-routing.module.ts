import { ConfigAddPromotionComponent } from './config-add-promotion/config-add-promotion.component';
import { ConfigAddProductComponent } from './config-add-product/config-add-product.component';
import { ConfigAddProductVariantComponent } from './config-add-product-variant/config-add-product-variant.component';
import { ConfigDecentralizePageComponent } from './config-users/config-decentralize-page/config-decentralize-page.component';
import { ConfigUsersDivideTaskComponent } from './config-users/config-users-divide-task/config-users-divide-task.component';
import { ConfigPrintBillsComponent } from './config-print-bills/config-print-bills.component';
import { ConfigPagesBasicComponent } from './config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigUsersShiftComponent } from './config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesDivideTaskComponent } from './config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigUsersOperationComponent } from './config-users/config-users-operation/config-users-operation.component';
import { ConfigPromotionsComponent } from './config-promotions/config-promotions.component';
import { ConfigActivitiesComponent } from './config-activities/config-activities.component';
import { ConfigProductsComponent } from './config-products/config-products.component';
import { ConfigProductVariantComponent } from './config-product-variant/config-product-variant.component';
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';
import { ConfigAutoChatComponent } from './config-auto-chat/config-auto-chat.component';
import { ConfigOverviewComponent } from './config-overview/config-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'overview',
    pathMatch:'full'
  },
  {
    path: '',
    component: ConfigComponent,
    children:[
      {
        path:'overview',
        component: ConfigOverviewComponent
      },
      {
        path:'print-bills',
        component: ConfigPrintBillsComponent
      },
      {
        path:'conversation-tags',
        component: ConfigConversationTagsComponent
      },
      {
        path:'auto-chat',
        component: ConfigAutoChatComponent
      },
      {
        path:'sms-messages',
        component: ConfigSmsMessagesComponent
      },
      {
        path:'product-variant',
        component: ConfigProductVariantComponent,
        
      },
      {
        path:'product-variant/create',
        component: ConfigAddProductVariantComponent
      },
      {
        path:'products',
        component: ConfigProductsComponent,
      },
      {
        path:'products/create',
        component: ConfigAddProductComponent
      },
      {
        path:'activities',
        component: ConfigActivitiesComponent
      },
      {
        path:'promotions',
        component: ConfigPromotionsComponent,
      },
      {
        path:'promotions/create',
        component: ConfigAddPromotionComponent
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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigsRoutingModule { }
