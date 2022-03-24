import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill/bill.component';
import { MainSharedModule } from '../../shared/shared.module';
import { TDSButtonModule, TDSTabsModule, TDSModalService, TDSFormFieldModule, TDSInputModule, TDSDropDownModule, TDSTableModule, TDSTagModule, TDSAvatarModule, TDSBadgeModule, TDSPopoverModule, TDSSkeletonModule, TDSSelectModule, TDSToolTipModule, TDSModalModule, TDSRadioModule, TDSDatePickerModule, TDSCheckBoxModule, TDSInputNumberModule, TDSButtonSpitModule, TDSDrawerModule } from 'tmt-tang-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FastSaleOrderService } from '../../services/fast-sale-order.service';

@NgModule({
  declarations: [
    BillComponent
  ],
  imports: [
    CommonModule,
    BillRoutingModule,
    MainSharedModule,
    TDSButtonModule,
    TDSTabsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSDropDownModule,
    TDSTableModule,
    TDSTagModule,
    TDSAvatarModule,
    TDSBadgeModule,
    TDSPopoverModule,
    TDSSelectModule ,
    FormsModule,
    TDSToolTipModule,
    TDSModalModule,
    FormsModule,
    ReactiveFormsModule,
    TDSRadioModule,
    TDSDatePickerModule,
    TDSCheckBoxModule,
    TDSInputNumberModule,
    TDSButtonSpitModule,
    TDSAvatarModule,
    TDSDrawerModule,
  ],
  providers: [
    FastSaleOrderService
  ]
})
export class BillModule { }
