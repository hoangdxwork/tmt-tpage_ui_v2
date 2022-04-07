import { ConfigPrintBillsComponent } from './components/config-print-bills/config-print-bills.component';
import { ConfigPagesBasicComponent } from './components/config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigUsersShiftComponent } from './components/config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesDivideTaskComponent } from './components/config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigUsersOperationComponent } from './components/config-users/config-users-operation/config-users-operation.component';
import { ConfigPromotionsComponent } from './components/config-promotions/config-promotions.component';
import { ConfigActivitiesComponent } from './components/config-activities/config-activities.component';
import { ConfigProductsComponent } from './components/config-products/config-products.component';
import { ConfigProductVariantComponent } from './components/config-product-variant/config-product-variant.component';
import { ConfigSmsMessagesComponent } from './components/config-sms-messages/config-sms-messages.component';
import { ConfigAutoChatComponent } from './components/config-auto-chat/config-auto-chat.component';
import { ConfigOverviewComponent } from './components/config-overview/config-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ConfigConversationTagsComponent } from './components/config-conversation-tags/config-conversation-tags.component';

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
        path:'product-forms',
        component: ConfigProductVariantComponent
      },
      {
        path:'products',
        component: ConfigProductsComponent
      },
      {
        path:'activities',
        component: ConfigActivitiesComponent
      },
      {
        path:'promotions',
        component: ConfigPromotionsComponent
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
            component: ConfigPagesDivideTaskComponent
          },
          {
            path:'shift',
            component: ConfigUsersShiftComponent
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
