import { AddBillComponent } from './components/add-bill/add-bill.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
