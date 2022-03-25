import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { TDSBadgeModule, TDSButtonModule, TDSDropDownModule, TDSFormFieldModule, TDSModalService, TDSPopoverModule, TDSSelectModule, TDSTableModule, TDSTabsModule, TDSTagModule } from 'tmt-tang-ui';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    TDSTabsModule,
    TDSTableModule,
    TDSTagModule,
    TDSBadgeModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSButtonModule,
    TDSDropDownModule,
    TDSPopoverModule,
    FormsModule,
  ]
})
export class OrderModule { }
