
import { ConfigAddProductComponent } from './config-add-product/config-add-product.component';
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
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';
import { AutoQuickReplyComponent } from './auto-quick-reply/auto-quick-reply.component';
import { AutoInteractionComponent } from './auto-interraction/auto-interaction.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';
import { ConfigAddPromotionComponent } from './config-promotions/components/config-add-promotion/config-add-promotion.component';
import { ConfigEditPromotionComponent } from './config-promotions/components/config-edit-promotion/config-edit-promotion.component';
import { ListProductVariantComponent } from './product-variant/list-product-variant.component';
import { CreateProductVariantComponent } from './product-variant/create/create-product-variant.component';

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
        component: AutoInteractionComponent
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
        path:'auto-reply',
        component: AutoQuickReplyComponent
      },
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
        component: ConfigProductsComponent,
      },
      {
        path:'products/create',
        component: ConfigAddProductComponent
      },
      {
        path:'products/edit/:id',
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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigsRoutingModule { }
