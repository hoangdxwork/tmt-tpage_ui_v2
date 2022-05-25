import { HistoryDeliveryStatusComponent } from './history-delivery-status/history-delivery-status.component';
import { DetailBillComponent } from './detail-bill/detail-bill.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from './bill/bill.component';

const routes: Routes = [
  {
    path: '',
    component: BillComponent
  },
  {
    path: 'create',
    component: AddBillComponent
  },
  {
    path: 'edit/:id',
    component: AddBillComponent
  },
  {
    path: 'detail/:id',
    component: DetailBillComponent
  },
  {
    path: 'historyds/list',
    component: HistoryDeliveryStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
