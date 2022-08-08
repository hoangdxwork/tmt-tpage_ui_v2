import { EditProductVariantComponent } from './edit-product-variant/edit-product-variant.component';
import { TDSNotificationModule } from 'tds-ui/notification';
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
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { AutoQuickReplyComponent } from './auto-quick-reply/auto-quick-reply.component';
import { ConfigConversationTagsComponent } from './config-conversation-tags/config-conversation-tags.component';
import { ConfigSmsMessagesComponent } from './config-sms-messages/config-sms-messages.component';

import { ConfigProductComponent } from './product/product.component';
import { ConfigActivitiesComponent } from './config-activities/config-activities.component';
import { ConfigPromotionsComponent } from './config-promotions/config-promotions.component';
import { ConfigUsersOperationComponent } from './config-users/config-users-operation/config-users-operation.component';
import { ConfigUsersDivideTaskComponent } from './config-users/config-users-divide-task/config-users-divide-task.component';
import { ConfigUsersShiftComponent } from './config-users/config-users-shift/config-users-shift.component';
import { ConfigPagesBasicComponent } from './config-pages/config-pages-basic/config-pages-basic.component';
import { ConfigPagesDivideTaskComponent } from './config-pages/config-pages-divide-task/config-pages-divide-task.component';
import { ConfigPrintBillsComponent } from './config-print-bills/config-print-bills.component';
import { CreateQuickReplyModalComponent } from './components/create-quick-repy-modal/create-quick-reply-modal.component';
import { SMSServiceModalComponent } from './components/sms-service-modal/sms-service-modal.component';
import { OdataCRMTagService } from '../../services/mock-odata/odata-crmtag.service';
import { QuickReplyService } from '../../services/quick-reply.service';
import { OdataQuickReplyService } from '../../services/mock-odata/odata-quick-reply.service';
import { RestSMSService } from '../../services/sms.service';
import { ProductService } from '../../services/product.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { ModalUpdateUserComponent } from './components/modal-update-user/modal-update-user.component';
import { ModalChangePasswordComponent } from './components/modal-change-password/modal-change-password.component';
import { ModalAddUserComponent } from './components/modal-add-user/modal-add-user.component';
import { ModalListShiftComponent } from './components/modal-list-shift/modal-list-shift.component';
import { ModalAddShiftComponent } from './components/modal-add-shift/modal-add-shift.component';
import { ModalUpdateShiftComponent } from './components/modal-update-shift/modal-update-shift.component';
import { ConfigDecentralizePageComponent } from './config-users/config-decentralize-page/config-decentralize-page.component';
import { CreateUOMModalComponent } from './components/create-UOM-modal/create-UOM-modal.component';
import { CreateCountryModalComponent } from './components/create-country-modal/create-country-modal.component';
import { ConfigAddProductComponent } from './create-product/create-product.component';
import { OdataTPosLoggingService } from '../../services/mock-odata/odata-tpos-logging.service';
import { OdataSaleCouponProgramService } from '../../services/mock-odata/odata-sale-coupon-program.service';
import { SaleCouponProgramService } from '../../services/sale-coupon-program.service';
import { ConfigAutoReplyComponent } from './config-pages/config-pages-basic/config-auto-reply/config-auto-reply.component';
import { ConfigAutoHideCommentComponent } from './config-pages/config-pages-basic/config-auto-hide-comment/config-auto-hide-comment.component';
import { ConfigInteractiveMenusComponent } from './config-pages/config-pages-basic/config-interactive-menus/config-interactive-menus.component';
import { ConfigQuickQuestionComponent } from './config-pages/config-pages-basic/config-quick-question/config-quick-question.component';
import { ConfigGreetingComponent } from './config-pages/config-pages-basic/config-greeting/config-greeting.component';
import { CreateTagModalComponent } from './components/create-tag-modal/create-tag-modal.component';
import { FacebookService } from '../../services/facebook.service';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ApplicationRoleService } from '../../services/application-role.service';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { ConfigAddAttributeProductModalComponent } from './components/config-attribute-modal/config-attribute-modal.component';
import { CompanyService } from '../../services/company.service';
import { ConfigPromotionGroupComponent } from './config-promotions/components/config-promotion-group/config-promotion-group.component';
import { ConfigPromotionComboComponent } from './config-promotions/components/config-promotion-combo/config-promotion-combo.component';
import { ConfigPromotionAllComponent } from './config-promotions/components/config-promotion-all/config-promotion-all.component';
import { ConfigEditPromotionComponent } from './config-promotions/components/config-edit-promotion/config-edit-promotion.component';
import { ConfigAddPromotionComponent } from './config-promotions/components/config-add-promotion/config-add-promotion.component';
import { ListProductVariantComponent } from './product-variant/product-variant.component';
import { CreateProductVariantComponent } from './create-product-variant/create-product-variant.component';
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
import { TDSEditorModule } from 'tds-editor';
import { CreateVariantsModalComponent } from './components/create-variants-modal/create-variants-modal.component';
import { FacebookCartComponent } from './facebook-cart/facebook-cart.component';
import { ListConfigDeliveryComponent } from './config-delivery/list-config-delivery.component';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSEmptyModule } from 'tds-ui/empty';
import { DeliveryCarrierV2Service } from '../../services/delivery-carrier-v2.service';
import { ConfigDeliveryConnectComponent } from './config-delivery/config-delivery-connect/config-delivery-connect.component';
import { ConfigDeliveryUpdateComponent } from './config-delivery/config-delivery-update/config-delivery-update.component';
import { UserRestHandler } from '../../handler-v2/user-rest.handler';


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
    DeliveryCarrierV2Service
]

@NgModule({
  declarations: [
    ConfigComponent,
    SaleOrderComponent,
    AutoQuickReplyComponent,
    ConfigConversationTagsComponent,
    ConfigSmsMessagesComponent,
    ListProductVariantComponent,
    ConfigProductComponent,
    ConfigActivitiesComponent,
    ConfigPromotionsComponent,
    ConfigUsersOperationComponent,
    ConfigUsersDivideTaskComponent,
    ConfigUsersShiftComponent,
    ConfigPagesBasicComponent,
    ConfigPagesDivideTaskComponent,
    ConfigPrintBillsComponent,
    CreateQuickReplyModalComponent,
    SMSServiceModalComponent,
    EditProductVariantComponent,
    ModalUpdateUserComponent,
    ModalChangePasswordComponent,
    ModalAddUserComponent,
    ModalListShiftComponent,
    ModalAddShiftComponent,
    ModalUpdateShiftComponent,
    CreateUOMModalComponent,
    CreateCountryModalComponent,
    CreateProductVariantComponent,
    ConfigAddProductComponent,
    ConfigDecentralizePageComponent,
    ConfigAutoReplyComponent,
    ConfigAutoHideCommentComponent,
    ConfigInteractiveMenusComponent,
    ConfigQuickQuestionComponent,
    ConfigGreetingComponent,
    CreateTagModalComponent,
    ProductDetailsComponent,
    ConfigAddAttributeProductModalComponent,
    ConfigAddPromotionComponent,
    ConfigEditPromotionComponent,
    ConfigPromotionGroupComponent,
    ConfigPromotionComboComponent,
    ConfigPromotionAllComponent,
    CreateVariantsModalComponent,
    ListConfigDeliveryComponent,
    ConfigDeliveryConnectComponent,
    ConfigDeliveryUpdateComponent,
    FacebookCartComponent,
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
    TDSEditorModule,
    TDSNotificationModule,
    TDSCollapseModule,
    TDSEmptyModule
  ],
  providers:[
    ...SERVICES
  ]
})
export class ConfigsModule { }
