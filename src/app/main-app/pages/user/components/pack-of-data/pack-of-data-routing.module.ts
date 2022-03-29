import { PackOfDataComponent } from './pack-of-data/pack-of-data.component';
import { ChoosePackOfDataComponent } from './choose-pack-of-data/choose-pack-of-data.component';
import { ExtendPackOfDataComponent } from './extend-pack-of-data/extend-pack-of-data.component';
import { InfoPaymentPackOfDataComponent } from './info-payment-pack-of-data/info-payment-pack-of-data.component';
import { InfoPackOfDataComponent } from './info-pack-of-data/info-pack-of-data.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'info',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PackOfDataComponent,
    children:[
      {
        path: 'info',
        component: InfoPackOfDataComponent,
      },
      {
        path: 'choose',
        component: ChoosePackOfDataComponent,
      },
      {
        path: 'extend',
        component: ExtendPackOfDataComponent,
      },
      {
        path: 'payment',
        component: InfoPaymentPackOfDataComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackOfDataRoutingModule { }
