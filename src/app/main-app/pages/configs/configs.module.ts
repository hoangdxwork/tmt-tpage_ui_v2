import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSButtonModule, TDSSwitchModule, TDSTabsModule, TDSBadgeModule, TDSInputModule, TDSSelectModule, TDSFormFieldModule, TDSTableModule, TDSToolTipModule, TDSButtonMenuModule, TDSModalService, TDSModalModule, TDSRadioModule, TDSBreadCrumbModule, TDSImageModule, TDSUploadModule, TDSDropDownModule, TDSCheckBoxModule, TDSInputNumberModule, TDSPopoverModule, TDSTagModule, TDSDatePickerModule } from 'tmt-tang-ui';
import { MainSharedModule } from './../../shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigsRoutingModule } from './configs-routing.module';
import { ConfigComponent } from './config/config.component';
import { ConfigOverviewComponent } from './config-overview/config-overview.component';
import { ConfigAutoChatComponent } from './config-auto-chat/config-auto-chat.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';
import { ConfigProductVariantComponent } from './config-product-variant/config-product-variant.component';
import { ConfigProductsComponent } from './config-products/config-products.component';
import { ConfigActivitiesComponent } from './config-activities/config-activities.component';
import { ConfigPromotionsComponent } from './config-promotions/config-promotions.component';
import { ConfigUsersOperationComponent } from './config-users/config-users-operation/config-users-operation.component';
import { ConfigUsersDivideTaskComponent } from './config-users/config-users-divide-task/config-users-divide-task.component';
import { ConfigUsersShiftComponent } from './config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesBasicComponent } from './config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigPagesDivideTaskComponent } from './config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigPrintBillsComponent } from './config-print-bills/config-print-bills.component';
import { AutoChatEditTagDataModalComponent } from './components/auto-chat-edit-tag-data-modal/auto-chat-edit-tag-data-modal.component';
import { AutoChatAddDataModalComponent } from './components/auto-chat-add-data-modal/auto-chat-add-data-modal.component';
import { SMSMessagesAddServiceModalComponent } from './components/sms-messages-add-service-modal/sms-messages-add-service-modal.component';
import { TableTemplateProductVariantComponent } from './components/table-template-product-variant/table-template-product-variant.component';
import { ProductVariantEditTableModalComponent } from './components/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { AddProductVariantComponent } from './config-product-variant/add-product-variant/add-product-variant.component';
import { ConfigAddPromotionComponent } from './config-promotions/config-add-promotion/config-add-promotion.component';
import { ConfigAddPromotionAllComponent } from './config-promotions/config-add-promotion-all/config-add-promotion-all.component';
import { ConfigAddPromotionGroupComponent } from './config-promotions/config-add-promotion-group/config-add-promotion-group.component';
import { ConfigAddPromotionComboComponent } from './config-promotions/config-add-promotion-combo/config-add-promotion-combo.component';


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
    AutoChatEditTagDataModalComponent,
    AutoChatAddDataModalComponent,
    SMSMessagesAddServiceModalComponent,
    TableTemplateProductVariantComponent,
    ProductVariantEditTableModalComponent,
    AddProductVariantComponent,
    ConfigAddPromotionComponent,
    ConfigAddPromotionAllComponent,
    ConfigAddPromotionGroupComponent,
    ConfigAddPromotionComboComponent,
  ],
  imports: [
    CommonModule,
    ConfigsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MainSharedModule,
    TDSAvatarModule,
    TDSButtonModule,
    TDSButtonMenuModule,
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
    TDSCheckBoxModule,
    TDSPopoverModule,
    TDSTagModule,
    TDSDatePickerModule
  ],
  providers:[TDSModalService]
})
export class ConfigsModule { }
