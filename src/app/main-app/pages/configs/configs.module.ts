import { CRMTagService } from './../../services/crm-tag.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ConfigConversationTagsEditDataModalComponent } from './components/config-conversation-tags-edit-data-modal/config-conversation-tags-edit-data-modal.component';
import { AutoChatAddDataModalComponent } from './components/auto-chat-add-data-modal/auto-chat-add-data-modal.component';
import { SMSMessagesAddServiceModalComponent } from './components/sms-messages-add-service-modal/sms-messages-add-service-modal.component';
import { TableTemplateProductVariantComponent } from './components/table-template-product-variant/table-template-product-variant.component';
import { ProductVariantEditTableModalComponent } from './components/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { ConfigAddPromotionComponent } from './config-add-promotion/config-add-promotion.component';
import { ConfigAddPromotionAllComponent } from './config-add-promotion/config-add-promotion-all/config-add-promotion-all.component';
import { ConfigAddPromotionGroupComponent } from './config-add-promotion/config-add-promotion-group/config-add-promotion-group.component';
import { ConfigAddPromotionComboComponent } from './config-add-promotion/config-add-promotion-combo/config-add-promotion-combo.component';
import { OdataCRMTagService } from '../../services/mock-odata/odata-crmtag.service';
import { QuickReplyService } from '../../services/quick-reply.service';
import { OdataQuickReplyService } from '../../services/mock-odata/odata-quick-reply.service';
import { RestSMSService } from '../../services/sms.service';
import { ProductService } from '../../services/product.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { ModalUpdateUserComponent } from './components/modal-update-user/modal-update-user.component';
import { ModalChangePasswordUserComponent } from './components/modal-change-password-user/modal-change-password-user.component';
import { ModalAddUserComponent } from './components/modal-add-user/modal-add-user.component';
import { ModalListShiftComponent } from './components/modal-list-shift/modal-list-shift.component';
import { ModalAddShiftComponent } from './components/modal-add-shift/modal-add-shift.component';
import { ModalUpdateShiftComponent } from './components/modal-update-shift/modal-update-shift.component';
import { ConfigDecentralizePageComponent } from './config-users/config-decentralize-page/config-decentralize-page.component';
import { TDSAvatarModule, TDSBadgeModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSDatePickerModule, TDSDropDownModule, TDSFormFieldModule, TDSImageModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSModalService, TDSPopoverModule, TDSRadioModule, TDSSelectModule, TDSSpinnerModule, TDSSwitchModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSTimePickerModule, TDSToolTipModule, TDSUploadModule } from 'tmt-tang-ui';
import { ConfigAddVariantProductModalComponent } from './components/config-add-variant-product-modal/config-add-variant-product-modal.component';
import { ConfigAddManufacturerModalComponent } from './components/config-add-manufacturer-modal/config-add-manufacturer-modal.component';
import { ConfigAddMadeInModalComponent } from './components/config-add-made-in-modal/config-add-made-in-modal.component';
import { ConfigAddProductVariantComponent } from './config-add-product-variant/config-add-product-variant.component';
import { ConfigAddProductComponent } from './config-add-product/config-add-product.component';
import { OdataTPosLoggingService } from '../../services/mock-odata/odata-tpos-logging.service';
import { OdataSaleCouponProgramService } from '../../services/mock-odata/odata-sale-coupon-program.service';
import { SaleCouponProgramService } from '../../services/sale-coupon-program.service';
import { ConfigConversationTagsCreateDataModalComponent } from './components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';

const SERVICES = [
    TDSModalService,
    OdataCRMTagService,
    OdataQuickReplyService,
    QuickReplyService,
    RestSMSService,
    OdataProductService,
    ProductService,
    OdataTPosLoggingService,
    OdataSaleCouponProgramService,
    SaleCouponProgramService,
    CRMTagService
]

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
    ConfigConversationTagsEditDataModalComponent,
    AutoChatAddDataModalComponent,
    SMSMessagesAddServiceModalComponent,
    TableTemplateProductVariantComponent,
    ProductVariantEditTableModalComponent,
    ConfigAddPromotionComponent,
    ConfigAddPromotionAllComponent,
    ConfigAddPromotionGroupComponent,
    ConfigAddPromotionComboComponent,
    ModalUpdateUserComponent,
    ModalChangePasswordUserComponent,
    ModalAddUserComponent,
    ModalListShiftComponent,
    ModalAddShiftComponent,
    ModalUpdateShiftComponent,
    ConfigAddVariantProductModalComponent,
    ConfigAddManufacturerModalComponent,
    ConfigAddMadeInModalComponent,
    ConfigAddProductVariantComponent,
    ConfigAddProductComponent,
    ConfigDecentralizePageComponent,
    ConfigConversationTagsCreateDataModalComponent
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
    TDSDatePickerModule,
    TDSSpinnerModule,
    TDSTimePickerModule,
  ],
  providers:[
    ...SERVICES
  ]
})
export class ConfigsModule { }
