import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBadgeModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSMessageModule, TDSModalModule, TDSPopoverModule, TDSRadioModule, TDSScrollIntoViewModule, TDSSelectModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSToolTipModule, TDSTypographyModule, TDSSwitchModule, TDSDrawerModule, TDSDatePickerModule, TDSImageModule, TDSEmptyModule, TDSUploadModule } from 'tmt-tang-ui';
import { TDSConversationsModule } from '../../shared/tds-conversations/tds-conversations.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalImageStoreComponent } from './components/modal-image-store/modal-image-store.component';
import { ConversationDataFacade } from '../../services/facades/conversation-data.facade';
import { ConversationFacebookState } from '../../services/facebook-state/conversation-facebook.state';
import { ConversationService } from '../../services/conversation/conversation.service';
import { ConversationEventFacade } from '../../services/facades/conversation-event.facade';
import { DraftMessageService } from '../../services/conversation/draft-message.service';
import { THelperCacheService } from 'src/app/lib';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { TDSSpinnerModule } from 'tmt-tang-ui';
import { ConversationOrderComponent } from './components/conversation-order/conversation-order.component';
import { ConversationPartnerComponent } from './components/conversation-partner/conversation-partner.component';
import { CurrentConversationItemComponent } from './components/current-conversation-item/current-conversation-item.component';
import { ConversationOrderFacade } from '../../services/facades/conversation-order.facade';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';
import { PartnerService } from '../../services/partner.service';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { CheckFormHandler } from '../../services/handlers/check-form.handler';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { CommonService } from '../../services/common.service';
import { FacebookGraphService } from '../../services/facebook-graph.service';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { ActivityMatchingService } from '../../services/conversation/activity-matching.service';
import { ApplicationUserService } from '../../services/application-user.service';
import { ModalConfirmPaymentComponent } from './components/modal-confirm-payment/modal-confirm-payment.component';
import { ModalAddQuickReplyComponent } from './components/modal-add-quick-reply/modal-add-quick-reply.component';
import { OrderPrintService } from '../../services/print/order-print.service';
import { PrinterService } from '../../services/printer.service';
import { OrderFormHandler } from '../../services/handlers/order-form.handler';
import { CarrierHandler } from '../../services/handlers/carier.handler';
import { SaleHandler } from '../../services/handlers/sale.handler';
import { ModalListProductComponent } from './components/modal-list-product/modal-list-product.component';
import { ModalListBillComponent } from './components/modal-list-bill/modal-list-bill.component';
import { ModalDetailBillComponent } from './components/modal-detail-bill/modal-detail-bill.component';
import { ModalConfirmShippingAddressComponent } from './components/modal-confirm-shipping-address/modal-confirm-shipping-address.component';
import { ModalBlockPhoneComponent } from './components/modal-block-phone/modal-block-phone.component';
import { CRMMatchingService } from '../../services/crm-matching.service';
import { FacebookPostService } from '../../services/facebook-post.service';
import { ConversationPostFacade } from '../../services/facades/conversation-post.facade';
import { FacebookCommentService } from '../../services/facebook-comment.service';
import { SharedService } from '../../services/shared.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { CRMTagService } from '../../services/crm-tag.service';
import { ModalListBlockComponent } from './components/modal-list-block/modal-list-block.component';
import { ExcelExportService } from '../../services/excel-export.service';
import { ManagePostCommentComponent } from './components/post-filter/manage-post-comment.component';
import { PostOrderComponent } from './components/post-order/post-order.component';
import { ConfigPostOutletComponent } from './components/config-post/config-post-outlet.component';
import { ConversationAllFilterComponent } from './components/conversation-all-filter/conversation-all-filter.component';
import { ConversationPostViewComponent } from './conversation-post/components/conversation-post-view/conversation-post-view.component';
import { ItemPostCommentComponent } from './conversation-post/components/item-post-comment/item-post-comment.component';
import { PostCommentAllComponent } from './components/post-filter/post-comment-all.component';
import { PostCommentGroupComponent } from './components/post-filter/post-comment-group.component';
import { PostCommentFilterComponent } from './components/post-filter/post-comment-filter.component';
import { ConversationOrderListComponent } from './components/conversation-order-list/conversation-order-list.component';
import { OdataSaleOnline_OrderService } from '../../services/mock-odata/odata-saleonlineorder.service';
import { AttachmentDataFacade } from '../../services/facades/attachment-data.facade';
import { AttachmentService } from '../../services/attachment.server';
import { AttachmentState } from '../../services/facebook-state/attachment.state';
import { ModalAddCollectionComponent } from './components/modal-add-collection/modal-add-collection.component';
import { PostOrderConfigComponent } from './components/config-post/order-config/post-order-config.component';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { ModalSelectAttachmentComponent } from './components/modal-select-attachment/modal-select-attachment.component';
import { ModalAddAttachmentCollectionComponent } from './components/modal-add-attachment-collection/modal-add-attachment-collection.component';
import { ModalSendMessageAllComponent } from './components/modal-send-message-all/modal-send-message-all.component';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { PostOrderInteractionConfigComponent } from './components/config-post/interaction-config/post-order-interaction-config.component';
import { PostHiddenCommentConfigComponent } from './components/config-post/hidden-comment-config/post-hidden-comment-config.component';
import { AutoLabelConfigComponent } from './components/config-post/label-config/auto-label-config.component';
import { AutoReplyConfigComponent } from './components/config-post/reply-config/auto-reply-config.component';
import { ModalReportOrderPostComponent } from './components/post-filter/modal-report-order-post.component';
import { ModalListCollectionComponent } from './components/modal-list-collection/modal-list-collection.component';

const SERVICES = [
  ConversationDataFacade,
  ConversationEventFacade,
  ConversationOrderFacade,
  ConversationPostFacade,
  ActivityDataFacade,
  ConversationFacebookState,
  ConversationService,
  DraftMessageService,
  THelperCacheService,
  SaleOnline_OrderService,
  PartnerService,
  FastSaleOrderService,
  CheckFormHandler,
  DeliveryCarrierService,
  CommonService,
  SaleHandler,
  FacebookGraphService,
  ActivityMatchingService,
  ApplicationUserService,
  OrderPrintService,
  PrinterService,
  OrderFormHandler,
  CarrierHandler,
  CRMMatchingService,
  FacebookPostService,
  FacebookCommentService,
  SharedService,
  CRMTagService,
  ExcelExportService,
  OdataSaleOnline_OrderService,
  AttachmentDataFacade,
  AttachmentService,
  AttachmentState,
  ProductIndexDBService,
  LiveCampaignService
]

@NgModule({
  declarations: [
    ConversationAllComponent,
    ConversationPostComponent,
    ModalImageStoreComponent,
    CurrentConversationItemComponent,
    ConversationOrderComponent,
    ConversationPartnerComponent,
    ModalListProductComponent,
    ModalListBillComponent,
    ModalDetailBillComponent,
    ModalConfirmShippingAddressComponent,
    ModalConfirmPaymentComponent,
    ModalAddQuickReplyComponent,
    ModalBlockPhoneComponent,
    ConversationPostViewComponent,
    ItemPostCommentComponent,
    ModalListBlockComponent,
    PostCommentAllComponent,
    PostCommentGroupComponent,
    PostCommentFilterComponent,
    ManagePostCommentComponent,
    PostOrderComponent,
    ConfigPostOutletComponent,
    ConversationAllFilterComponent,
    ConversationOrderListComponent,
    AutoLabelConfigComponent,
    ConversationAllFilterComponent,
    ModalAddCollectionComponent,
    PostOrderConfigComponent,
    ModalSelectAttachmentComponent,
    ModalAddAttachmentCollectionComponent,
    ModalSendMessageAllComponent,
    PostOrderInteractionConfigComponent,
    PostHiddenCommentConfigComponent,
    AutoReplyConfigComponent,
    ModalReportOrderPostComponent,
    ModalListCollectionComponent
  ],

  imports: [
    CommonModule,
    ConversationsRoutingModule,
    MainSharedModule,
    TDSConversationsModule,
    ReactiveFormsModule,
    FormsModule,
    TDSAvatarModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSAutocompleteModule,
    TDSBadgeModule,
    TDSTagModule,
    TDSPopoverModule,
    TDSTabsModule,
    TDSButtonModule,
    TDSButtonMenuModule,
    TDSDropDownModule,
    TDSCollapseModule,
    TDSFilterStatusModule,
    TDSTableModule,
    TDSCheckBoxModule,
    TDSRadioModule,
    TDSToolTipModule,
    TDSModalModule,
    TDSMessageModule,
    TDSTypographyModule,
    UploadImageModule,
    TDSSpinnerModule,
    TDSSwitchModule,
    TDSInputNumberModule,
    TDSDrawerModule,
    TDSDatePickerModule,
    TDSImageModule,
    PipeModule,
    TDSEmptyModule,
    TDSUploadModule,
  ],
  providers: [ ...SERVICES]
})
export class ConversationsModule { }
