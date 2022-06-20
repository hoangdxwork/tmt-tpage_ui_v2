import { ConfigDataFacade } from './../../services/facades/config-data.facade';
import { ExcelExportService } from './../../services/excel-export.service';
import { TagProductTemplateService } from './../../services/tag-product-template.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { ProductTemplateService } from './../../services/product-template.service';
import { PipeModule } from './../../shared/pipe/pipe.module';
import { StockMoveService } from '../../services/stock-move.service';
import { OdataProductTemplateService } from '../../services/mock-odata/odata-product-template.service';
import { CRMTagService } from './../../services/crm-tag.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainSharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigsRoutingModule } from './configs-routing.module';
import { ConfigComponent } from './config/config.component';
import { AutoInteractionComponent } from './auto-interraction/auto-interaction.component';
import { AutoQuickReplyComponent } from './auto-quick-reply/auto-quick-reply.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';

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
import { ConfigAddUOMModalComponent } from './components/config-add-UOM-modal/config-add-UOM-modal.component';
import { ConfigAddOriginCountryModalComponent } from './components/config-add-origin-country-modal/config-add-origin-country-modal.component';
import { ConfigAddProductComponent } from './config-add-product/config-add-product.component';
import { OdataTPosLoggingService } from '../../services/mock-odata/odata-tpos-logging.service';
import { OdataSaleCouponProgramService } from '../../services/mock-odata/odata-sale-coupon-program.service';
import { SaleCouponProgramService } from '../../services/sale-coupon-program.service';
import { ConfigAutoReplyComponent } from './config-pages/config-pages-basic/config-auto-reply/config-auto-reply.component';
import { ConfigAutoHideCommentComponent } from './config-pages/config-pages-basic/config-auto-hide-comment/config-auto-hide-comment.component';
import { ConfigInteractiveMenusComponent } from './config-pages/config-pages-basic/config-interactive-menus/config-interactive-menus.component';
import { ConfigQuickQuestionComponent } from './config-pages/config-pages-basic/config-quick-question/config-quick-question.component';
import { ConfigGreetingComponent } from './config-pages/config-pages-basic/config-greeting/config-greeting.component';
import { ConfigConversationTagsCreateDataModalComponent } from './components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { FacebookService } from '../../services/facebook.service';
import { ConfigProductDetailsComponent } from './components/config-product-details/config-product-details.component';
import { ConfigAddCategoryModalComponent } from './components/config-add-category-modal/config-add-category-modal.component';
import { ApplicationRoleService } from '../../services/application-role.service';
import { UserRestHandler } from '../../services/handlers/user-rest.handler';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { ConfigAddAttributeProductModalComponent } from './components/config-add-attribute-product-modal/config-add-attribute-product-modal.component';
import { CompanyService } from '../../services/company.service';
import { ConfigPromotionGroupComponent } from './config-promotions/components/config-promotion-group/config-promotion-group.component';
import { ConfigPromotionComboComponent } from './config-promotions/components/config-promotion-combo/config-promotion-combo.component';
import { ConfigPromotionAllComponent } from './config-promotions/components/config-promotion-all/config-promotion-all.component';
import { ConfigEditPromotionComponent } from './config-promotions/components/config-edit-promotion/config-edit-promotion.component';
import { ConfigAddPromotionComponent } from './config-promotions/components/config-add-promotion/config-add-promotion.component';
import { ListProductVariantComponent } from './product-variant/list-product-variant.component';
import { EditProductVariantComponent } from './product-variant/edit/edit-product-variant.component';
import { CreateProductVariantComponent } from './product-variant/create/create-product-variant.component';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { TDSModalModule, TDSModalService } from 'tds-ui/modal';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSImageModule } from 'tds-ui/image';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
// import { TDSEditorModule } from 'tds-editor';

const SERVICES = [
    OdataCRMTagService,
    OdataQuickReplyService,
    QuickReplyService,
    RestSMSService,
    OdataProductService,
    ProductService,
    OdataTPosLoggingService,
    OdataSaleCouponProgramService,
    SaleCouponProgramService,
    CRMTagService,
    FacebookService,
    OdataProductTemplateService,
    ProductTemplateService,
    StockMoveService,
    TagService,
    TagProductTemplateService,
    ExcelExportService,
    ApplicationRoleService,
    UserRestHandler,
    CompanyService,
    ProductIndexDBService,
    THelperCacheService,
    ConfigDataFacade
]

@NgModule({
  declarations: [
    ConfigComponent,
    AutoInteractionComponent,
    AutoQuickReplyComponent,
    ConfigConversationTagsComponent,
    ConfigSmsMessagesComponent,
    ListProductVariantComponent,
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
    EditProductVariantComponent,
    ModalUpdateUserComponent,
    ModalChangePasswordUserComponent,
    ModalAddUserComponent,
    ModalListShiftComponent,
    ModalAddShiftComponent,
    ModalUpdateShiftComponent,
    ConfigAddUOMModalComponent,
    ConfigAddOriginCountryModalComponent,
    CreateProductVariantComponent,
    ConfigAddProductComponent,
    ConfigDecentralizePageComponent,
    ConfigAutoReplyComponent,
    ConfigAutoHideCommentComponent,
    ConfigInteractiveMenusComponent,
    ConfigQuickQuestionComponent,
    ConfigGreetingComponent,
    ConfigConversationTagsCreateDataModalComponent,
    ConfigProductDetailsComponent,
    ConfigAddCategoryModalComponent,
    ConfigAddAttributeProductModalComponent,
    ConfigAddPromotionComponent,
    ConfigEditPromotionComponent,
    ConfigPromotionGroupComponent,
    ConfigPromotionComboComponent,
    ConfigPromotionAllComponent
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
    TDSCheckBoxModule,
    TDSPopoverModule,
    TDSTagModule,
    TDSDatePickerModule,
    TDSSpinnerModule,
    TDSTimePickerModule,
    PipeModule,
    TDSFilterStatusModule,
    UploadImageModule,
    // TDSEditorModule
  ],
  providers:[
    ...SERVICES
  ]
})
export class ConfigsModule { }
