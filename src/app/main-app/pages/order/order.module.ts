import { CommonService } from 'src/app/main-app/services/common.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { TDSBadgeModule, TDSButtonModule, TDSCheckBoxModule, TDSContextMenuService, TDSDatePickerModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormField, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalService, TDSPopoverModule, TDSSelectModule, TDSSpinnerModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSModalModule, TDSAvatarComponent, TDSAvatarModule, TDSCollapseModule, TDSToolTipModule } from 'tmt-tang-ui';
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

const SERVICES = [
  OdataSaleOnline_OrderService,
  SaleOnline_OrderService,
  TDSModalService,
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
  CarrierHandler
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
    UpdateInfoPartnerComponent
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
    TDSToolTipModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class OrderModule { }
