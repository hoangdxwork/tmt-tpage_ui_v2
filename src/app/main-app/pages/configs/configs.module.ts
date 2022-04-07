import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule, TDSSwitchModule, TDSTabsModule, TDSBadgeModule, TDSInputModule, TDSSelectModule, TDSFormFieldModule, TDSTableModule, TDSToolTipModule, TDSButtonMenuModule, TDSModalService, TDSModalModule, TDSRadioModule, TDSBreadCrumbModule, TDSImageModule, TDSUploadModule, TDSDropDownModule, TDSCheckBoxModule, TDSInputNumberModule } from 'tmt-tang-ui';
import { MainSharedModule } from './../../shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigsRoutingModule } from './configs-routing.module';
import { ConfigComponent } from './config/config.component';
import { ConfigOverviewComponent } from './components/config-overview/config-overview.component';
import { ConfigAutoChatComponent } from './components/config-auto-chat/config-auto-chat.component';
import { ConfigConversationTagsComponent } from './components/config-conversation-tags/config-conversation-tags.component';
import { ConfigSmsMessagesComponent } from './components/config-sms-messages/config-sms-messages.component';
import { ConfigProductVariantComponent } from './components/config-product-variant/config-product-variant.component';
import { ConfigProductsComponent } from './components/config-products/config-products.component';
import { ConfigActivitiesComponent } from './components/config-activities/config-activities.component';
import { ConfigPromotionsComponent } from './components/config-promotions/config-promotions.component';
import { ConfigUsersOperationComponent } from './components/config-users/config-users-operation/config-users-operation.component';
import { ConfigUsersDivideTaskComponent } from './components/config-users/config-users-divide-task/config-users-divide-task.component';
import { ConfigUsersShiftComponent } from './components/config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesBasicComponent } from './components/config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigPagesDivideTaskComponent } from './components/config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigPrintBillsComponent } from './components/config-print-bills/config-print-bills.component';
import { EditDataModalComponent } from './components/config-conversation-tags/edit-data-modal/edit-data-modal.component';
import { AutoChatAddDataModalComponent } from './components/config-auto-chat/auto-chat-add-data-modal/auto-chat-add-data-modal.component';
import { AddServiceModalComponent } from './components/config-sms-messages/add-service-modal/add-service-modal.component';
import { TableTemplateProductVariantComponent } from './components/config-product-variant/table-template-product-variant/table-template-product-variant.component';
import { ProductVariantEditTableModalComponent } from './components/config-product-variant/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { AddProductVariantComponent } from './components/config-product-variant/add-product-variant/add-product-variant.component';


@NgModule({
  declarations: [
    ConfigComponent,
    ConfigOverviewComponent,
    ConfigAutoChatComponent,
    ConfigConversationTagsComponent,
    ConfigSmsMessagesComponent,
    ConfigProductVariantComponent,
    ConfigProductsComponent,
    ConfigActivitiesComponent,
    ConfigPromotionsComponent,
    ConfigUsersOperationComponent,
    ConfigUsersDivideTaskComponent,
    ConfigUsersShiftComponent,
    ConfigPagesBasicComponent,
    ConfigPagesDivideTaskComponent,
    ConfigPrintBillsComponent,
    EditDataModalComponent,
    AutoChatAddDataModalComponent,
    AddServiceModalComponent,
    TableTemplateProductVariantComponent,
    ProductVariantEditTableModalComponent,
    AddProductVariantComponent,
  ],
  imports: [
    CommonModule,
    ConfigsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MainSharedModule,
    TDSAvatarModule,
    TDSButtonModule,
    TDSTabsModule,
    TDSSwitchModule,
    TDSBadgeModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSInputNumberModule,
    TDSTableModule,
    TDSToolTipModule,
    TDSButtonMenuModule,
    TDSModalModule,
    TDSRadioModule,
    TDSBreadCrumbModule,
    TDSImageModule,
    TDSUploadModule,
    TDSDropDownModule,
    MainSharedModule,
    TDSCheckBoxModule
  ],
  providers:[TDSModalService]
})
export class ConfigsModule { }
