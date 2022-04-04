import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { TDSBadgeModule, TDSButtonModule, TDSCheckBoxModule, TDSContextMenuService, TDSDatePickerModule, TDSDropDownModule, TDSFilterStatusModule, TDSFormField, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalService, TDSPopoverModule, TDSSelectModule, TDSSpinnerModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSModalModule, TDSAvatarComponent, TDSAvatarModule, TDSCollapseModule } from 'tmt-tang-ui';
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
import { DeliveryCarrierService } from '../../services/delivery-carrier-order.service';
import { DuplicateUserComponent } from './components/duplicate-user/duplicate-user.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';

const SERVICES = [
  OdataSaleOnline_OrderService,
  SaleOnline_OrderService,
  TDSModalService,
  TagService,
  DeliveryCarrierService
]

@NgModule({
  declarations: [
    OrderComponent,
    ActionDropdownComponent,
    FilterOptionsComponent,
    ConfigColumnComponent,
    UpdateStatusOrderComponent,
    DuplicateUserComponent,
    EditOrderComponent
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
    TDSCollapseModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class OrderModule { }
