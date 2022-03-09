import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill/bill.component';


@NgModule({
  declarations: [
    BillComponent
  ],
  imports: [
    CommonModule,
    BillRoutingModule
  ]
})
export class BillModule { }
