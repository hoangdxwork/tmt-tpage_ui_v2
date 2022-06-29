import { AttachmentState } from './../../services/facebook-state/attachment.state';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentDataFacade } from './../../services/facades/attachment-data.facade';
import { OrderFormHandler } from './../../services/handlers/order-form.handler';
import { ConversationOrderFacade } from './../../services/facades/conversation-order.facade';
import { ConversationEventFacade } from './../../services/facades/conversation-event.facade';
import { DraftMessageService } from './../../services/conversation/draft-message.service';
import { ConversationDataFacade } from './../../services/facades/conversation-data.facade';
import { ActivityDataFacade } from './../../services/facades/activity-data.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSConversationsModule } from './../../shared/tds-conversations/tds-conversations.module';
import { UploadImageModule } from './../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { TDSDrawerModule } from 'tds-ui/drawer';
import { CRMMatchingService } from './../../services/crm-matching.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';
import { OdataSaleOnline_OrderService } from '../../services/mock-odata/odata-saleonlineorder.service';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { ConfigColumnComponent } from './components/config-column/config-column.component';
import { UpdateStatusOrderComponent } from './components/update-status-order/update-status-order.component';
import { MainSharedModule } from '../../shared/shared.module';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { TagService } from '../../services/tag.service';
import { DuplicateUserComponent } from './components/duplicate-user/duplicate-user.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';
import { CreateBillFastComponent } from './components/create-bill-fast/create-bill-fast.component';
import { CreateBillFastErrorComponent } from './components/create-bill-fast-error/create-bill-fast-error.component';
import { CreateBillDefaultComponent } from './components/create-bill-default/create-bill-default.component';
import { CreateBillDefaultErrorComponent } from './components/create-bill-default-error/create-bill-default-error.component';
import { InfoOrderDebtComponent } from './components/info-order-debt/info-order-debt.component';
import { InfoPartnerComponent } from './components/info-partner/info-partner.component';
import { PartnerService } from '../../services/partner.service';
import { UpdateInfoPartnerComponent } from './components/update-info-partner/update-info-partner.component';
import { PrinterService } from '../../services/printer.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { DeliveryCarrierService } from '../../services/delivery-carrier.service';
import { OdataProductService } from '../../services/mock-odata/odata-product.service';
import { CheckFormHandler } from '../../services/handlers/check-form.handler';
import { CarrierHandler } from '../../services/handlers/carier.handler';
import { SaleHandler } from '../../services/handlers/sale.handler';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSTableModule } from 'tds-ui/table';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { OrderPrintService } from '../../services/print/order-print.service';

const SERVICES = [
  OdataSaleOnline_OrderService,
  SaleOnline_OrderService,
  TagService,
  DeliveryCarrierService,
  CommonService,
  FastSaleOrderService,
  PartnerService,
  PrinterService,
  ExcelExportService,
  SaleHandler,
  CheckFormHandler,
  OdataProductService,
  CarrierHandler,
  OrderPrintService,
  CRMMatchingService,
  TDSMessageService,
  ActivityDataFacade,
  ConversationDataFacade,
  DraftMessageService,
  ConversationEventFacade,
  ConversationOrderFacade,
  OrderFormHandler,
  AttachmentDataFacade,
  AttachmentService,
  AttachmentState,
]

@NgModule({
  declarations: [
    OrderComponent,
    ActionDropdownComponent,
    FilterOptionsComponent,
    ConfigColumnComponent,
    UpdateStatusOrderComponent,
    DuplicateUserComponent,
    EditOrderComponent,
    CreateBillFastComponent,
    CreateBillFastErrorComponent,
    CreateBillDefaultComponent,
    CreateBillDefaultErrorComponent,
    InfoOrderDebtComponent,
    InfoPartnerComponent,
    UpdateInfoPartnerComponent,
  ],
  imports: [
    CommonModule,
    MainSharedModule,
    PipeModule,
    FormsModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    TDSTabsModule,
    TDSTableModule,
    TDSTagModule,
    TDSBadgeModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSButtonModule,
    TDSDropDownModule,
    TDSPopoverModule,
    TDSFilterStatusModule,
    TDSSpinnerModule,
    TDSInputNumberModule,
    TDSInputModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSModalModule,
    TDSAvatarModule,
    TDSCollapseModule,
    TDSToolTipModule,
    TDSDrawerModule,
    UploadImageModule,
    TDSConversationsModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class OrderModule { }
