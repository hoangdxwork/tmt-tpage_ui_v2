import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { ConversationService } from './../../services/conversation/conversation.service';
import { ActivityMatchingService } from './../../services/conversation/activity-matching.service';
import { ChatomniMessageFacade } from './../../services/chatomni-facade/chatomni-message.facade';
import { OdataProductService } from './../../services/mock-odata/odata-product.service';
import { AttachmentState } from './../../services/facebook-state/attachment.state';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentDataFacade } from './../../services/facades/attachment-data.facade';
import { UploadImageModule } from './../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { RestSMSService } from './../../services/sms.service';
import { QuickReplyService } from './../../services/quick-reply.service';
import { ModalPaymentComponent } from './components/modal-payment/modal-payment.component';
import { ModalBirthdayPartnerComponent } from './components/modal-birthday-partner/modal-birthday-partner.component';
import { ModalSampleMessageComponent } from './components/modal-sample-message/modal-sample-message.component';
import { ModalSendMessageComponent } from './components/modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './components/modal-convert-partner/modal-convert-partner.component';
import { ModalEditPartnerComponent } from './components/modal-edit-partner/modal-edit-partner.component';
import { ModalAddAddressComponent } from './components/modal-add-address/modal-add-address.component';
import { ExpandPartnerDetailComponent } from './components/expand-partner-detail/expand-partner-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner/partner.component';
import { OdataPartnerService } from '../../services/mock-odata/odata-partner.service';
import { CommonService } from '../../services/common.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { PartnerService } from '../../services/partner.service';
import { TagService } from '../../services/tag.service';
import { ConfigColumPartnerComponent } from './components/config-column/config-column-partner.component';
import { MainSharedModule } from '../../shared/shared.module';
import { PrinterService } from '../../services/printer.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { FilterOptionPartnerComponent } from './components/filter-option-partner/filter-option-partner.component';
import { AccountRegisterPaymentService } from '../../services/account-register-payment.service';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSTableModule } from 'tds-ui/table';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSButtonSpitModule } from 'tds-ui/buttton-split';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSMessageModule } from 'tds-ui/message';
import { TDSNotificationModule } from 'tds-ui/notification';
import { TDSAlertModule } from 'tds-ui/alert';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSConversationsModule } from '../../shared/tds-conversations/tds-conversations.module';
import { CRMMatchingService } from '../../services/crm-matching.service';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { ConversationDataFacade } from '../../services/facades/conversation-data.facade';
import { ConversationEventFacade } from '../../services/facades/conversation-event.facade';
import { ConversationOrderFacade } from '../../services/facades/conversation-order.facade';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ChatomniMessageService } from '@app/services/chatomni-service/chatomni-message.service';

const SERVICES = [
  OdataPartnerService,
  CommonService,
  PartnerService,
  TagService,
  PrinterService,
  ExcelExportService,
  AccountRegisterPaymentService,
  QuickReplyService,
  RestSMSService,
  CRMMatchingService,
  ActivityDataFacade,
  ConversationDataFacade,
  ConversationEventFacade,
  ConversationOrderFacade,
  FastSaleOrderService,
  DeliveryCarrierService,
  AttachmentDataFacade,
  AttachmentService,
  AttachmentState,
  OdataProductService,
  ChatomniMessageService,
  ChatomniMessageFacade,
  ActivityMatchingService,
  ConversationService,
  ChatomniCommentFacade
]

@NgModule({
  declarations: [
    PartnerComponent,
    ExpandPartnerDetailComponent,
    ModalAddAddressComponent,
    ModalEditPartnerComponent,
    ModalConvertPartnerComponent,
    ModalSendMessageComponent,
    ModalSampleMessageComponent,
    ModalBirthdayPartnerComponent,
    ModalPaymentComponent,
    ConfigColumPartnerComponent,
    FilterOptionPartnerComponent
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    TDSButtonModule,
    TDSTabsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSDropDownModule,
    TDSTableModule,
    TDSTagModule,
    TDSAvatarModule,
    TDSUploadModule,
    TDSBadgeModule,
    TDSPopoverModule,
    TDSSelectModule ,
    FormsModule,
    TDSToolTipModule,
    TDSModalModule,
    ReactiveFormsModule,
    TDSRadioModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSInputNumberModule,
    TDSButtonSpitModule,
    TDSAvatarModule,
    TDSDrawerModule,
    TDSFilterStatusModule,
    TDSSpinnerModule,
    TDSMessageModule,
    PipeModule,
    TDSSpinnerModule,
    TDSNotificationModule,
    TDSAlertModule,
    CommonModule,
    MainSharedModule,
    TDSTypographyModule,
    TDSEmptyModule,
    TDSConversationsModule,
    DirectivesModule,
    UploadImageModule,
  ],
  providers: [
    ...SERVICES,
   ],
})
export class PartnerModule { }
