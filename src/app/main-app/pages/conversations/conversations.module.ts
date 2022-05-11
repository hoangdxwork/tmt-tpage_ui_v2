import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationAllComponent } from './conversation-all/conversation-all.component';
import { ConversationPostComponent } from './conversation-post/conversation-post.component';
import { ConversationCommentComponent } from './conversation-comment/conversation-comment.component';
import { ConversationInboxComponent } from './conversation-inbox/conversation-inbox.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBadgeModule, TDSButtonMenuModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSMessageModule, TDSModalModule, TDSPopoverModule, TDSRadioModule, TDSScrollIntoViewModule, TDSSelectModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSToolTipModule, TDSTypographyModule, TDSSwitchModule } from 'tmt-tang-ui';
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

const SERVICES = [
  ConversationDataFacade,
  ConversationEventFacade,
  ConversationOrderFacade,
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
  CarrierHandler
]

@NgModule({
  declarations: [
    ConversationAllComponent,
    ConversationPostComponent,
    ConversationCommentComponent,
    ConversationInboxComponent,
    ModalImageStoreComponent,
    CurrentConversationItemComponent,
    ConversationOrderComponent,
    ConversationPartnerComponent,
    ModalListProductComponent,
    ModalListBillComponent,
    ModalDetailBillComponent,
    ModalConfirmShippingAddressComponent,
    ModalConfirmPaymentComponent,
    ModalAddQuickReplyComponent
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
    TDSInputNumberModule
  ],
  providers: [ ...SERVICES]
})
export class ConversationsModule { }
