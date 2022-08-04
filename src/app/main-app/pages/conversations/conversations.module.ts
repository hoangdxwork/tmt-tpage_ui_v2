import { OdataSaleCouponProgramService } from 'src/app/main-app/services/mock-odata/odata-sale-coupon-program.service';
import { AccountRegisterPaymentService } from './../../services/account-register-payment.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';
import { MainSharedModule } from '../../shared/shared.module';
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
import { ConversationOrderComponent } from './components/conversation-order/conversation-order.component';
import { ConversationPartnerComponent } from './components/conversation-partner/conversation-partner.component';
import { CurrentConversationItemComponent } from './components/current-conversation-item/current-conversation-item.component';
import { ConversationOrderFacade } from '../../services/facades/conversation-order.facade';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';
import { PartnerService } from '../../services/partner.service';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
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
import { ModalListProductComponent } from './components/modal-list-product/modal-list-product.component';
import { ModalListBillComponent } from './components/modal-list-bill/modal-list-bill.component';
import { ModalDetailBillComponent } from './components/modal-detail-bill/modal-detail-bill.component';
import { ModalConfirmShippingAddressComponent } from './components/modal-confirm-shipping-address/modal-confirm-shipping-address.component';
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
import { PostCommentAllComponent } from './components/post-filter/post-comment-all.component';
import { PostCommentGroupComponent } from './components/post-filter/post-comment-group.component';
import { PostCommentFilterComponent } from './components/post-filter/post-comment-filter.component';
import { ConversationOrderListComponent } from './components/conversation-order-list/conversation-order-list.component';
import { OdataSaleOnline_OrderService } from '../../services/mock-odata/odata-saleonlineorder.service';
import { AttachmentDataFacade } from '../../services/facades/attachment-data.facade';
import { AttachmentService } from '../../services/attachment.service';
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
import { ModalTaxComponent } from './components/modal-tax/modal-tax.component';
import { AccountTaxService } from '../../services/account-tax.service';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ConversationPostViewComponent } from './conversation-post/conversation-post-view.component';
import { ItemPostCommentComponent } from './conversation-post/item-post-comment.component';
import { ModalBlockPhoneComponent } from './components/modal-block-phone/modal-block-phone.component';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSAutocompleteModule } from 'tds-ui/auto-complete';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSTableModule } from 'tds-ui/table';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSImageModule } from 'tds-ui/image';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSMessageModule, TDSMessageService } from 'tds-ui/message';
import { ProductPagefbComponent } from './components/product-pagefb/product-pagefb.component';
import { ModalApplyPromotionComponent } from './components/modal-apply-promotion/modal-apply-promotion.component';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { ModalPostComponent } from './components/modal-post/modal-post.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModalRenameAttachmentComponent } from './components/modal-rename-attachment/modal-rename-attachment.component';
import { ChatomniMessageFacade } from '../../services/chatomni-facade/chatomni-message.facade';
import { CrmMatchingV2Facade } from '../../services/matching-v2-facade/crm-matching-v2.facade';
import { CrmMatchingV2Service } from '../../services/matching-v2-service/crm-matching-v2.service';
import { ChatomniConversationService } from '../../services/chatomni-service/chatomni-conversation.service';
import { ConversationAllV2Component } from './conversation-all/conversation-all-v2.component';
import { CurrentConversationItemV2Component } from './components/current-conversation-item/current-conversation-item-v2.component';
import { CsPartner_SuggestionHandler } from '../../handler-v2/chatomni-cspartner/prepare-suggestion.handler';
import { CsPartner_PrepareModelHandler } from '../../handler-v2/chatomni-cspartner/prepare-partner.handler';
import { CsOrder_SuggestionHandler } from '../../handler-v2/chatomni-csorder/prepare-suggestions.handler';
import { CsOrder_PrepareModelHandler } from '../../handler-v2/chatomni-csorder/prepare-order.handler';
import { ChatomniCommentService } from '../../services/chatomni-service/chatomni-comment.service';
import { UpdateShipmentDetailAshipHandler } from '@app/handler-v2/aship-v2/shipment-detail-aship.handler';
import { UpdateShipServiceExtrasHandler } from '@app/handler-v2/aship-v2/update-shipservice-extras.handler';
import { UpdateShipExtraHandler } from '@app/handler-v2/aship-v2/update-shipextra.handler';
import { SelectShipServiceV2Handler } from '@app/handler-v2/aship-v2/select-shipservice-v2.handler';
import { PrepareModelFeeV2Handler } from '@app/handler-v2/aship-v2/prepare-model-feev2.handler';
import { SO_ComputeCaclHandler } from '@app/handler-v2/order-handler/compute-cacl.handler';
import { CalculateFeeAshipHandler } from '@app/handler-v2/aship-v2/calcfee-aship.handler';
import { ChatomniMessageService } from '@app/services/chatomni-service/chatomni-message.service';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ConversationPostV2Component } from './conversation-post/conversation-post-v2.component';
import { ChatomniObjectsService } from '@app/services/chatomni-service/chatomni-objects.service';
import { ConversationPostViewV2Component } from './conversation-post/conversation-post-view-v2.component';
import { ChatomniObjectsFacade } from '@app/services/chatomni-facade/chatomni-objects.facade';
import { ConversationPostViewV3Component } from './conversation-post/conversation-post-view-v3.component';

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
  DeliveryCarrierService,
  CommonService,
  FacebookGraphService,
  ActivityMatchingService,
  ApplicationUserService,
  OrderPrintService,
  PrinterService,
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
  LiveCampaignService,
  AccountTaxService,
  AccountRegisterPaymentService,
  OdataSaleCouponProgramService,
  OdataProductService,
  FacebookCommentService,
  ChatomniMessageFacade,
  CrmMatchingV2Service,
  CrmMatchingV2Facade,
  ChatomniConversationService,
  CsPartner_SuggestionHandler,
  CsPartner_PrepareModelHandler,
  CsOrder_SuggestionHandler,
  CsOrder_PrepareModelHandler,
  ChatomniCommentService,
  UpdateShipmentDetailAshipHandler,
  UpdateShipServiceExtrasHandler,
  UpdateShipExtraHandler,
  SelectShipServiceV2Handler,
  PrepareModelFeeV2Handler,
  SO_ComputeCaclHandler,
  CalculateFeeAshipHandler,
  ChatomniMessageService,
  ChatomniConversationFacade,
  ChatomniObjectsService,
  ChatomniObjectsFacade
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
    ModalListCollectionComponent,
    ModalTaxComponent,
    ProductPagefbComponent,
    ModalApplyPromotionComponent,
    ModalPostComponent,
    ModalRenameAttachmentComponent,
    ConversationAllV2Component,
    CurrentConversationItemV2Component,
    ConversationPostV2Component,
    ConversationPostViewV2Component,
    ConversationPostViewV3Component
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
    DirectivesModule,
    ScrollingModule
  ],
  providers: [ ...SERVICES]
})

export class ConversationsModule { }
