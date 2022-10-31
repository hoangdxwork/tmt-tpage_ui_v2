import { HistoryDeliveryStatusDetailComponent } from './history-delivery-status-detail/history-delivery-status-detail.component';
import { HistoryDeliveryStatusComponent } from './history-delivery-status/history-delivery-status.component';
import { DetailBillComponent } from './detail-bill/detail-bill.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { TrackingRefBlankComponent } from '@app/shared/trackingref-blank/trackingref-blank.component';

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
    path: 'copy/:id',
    component: AddBillComponent
  },
  {
    path: 'detail/:id',
    component: DetailBillComponent
  },
  {
    path: 'historyds/list',
    component: HistoryDeliveryStatusComponent
  },
  {
    path: 'historyds/:id',
    component: HistoryDeliveryStatusDetailComponent
  },
  {
    path: 'trackingref-blank/:id',
    component: TrackingRefBlankComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BillRoutingModule { }
