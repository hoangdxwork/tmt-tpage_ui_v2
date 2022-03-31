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
    path: 'add-new',
    component: AddBillComponent
  },
  {
    path: 'detail',
    component: DetailBillComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
