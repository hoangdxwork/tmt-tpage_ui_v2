import { NotificationUserComponent } from './components/notification-user/notification-user.component';
import { InfoUserComponent } from './components/info-user/info-user.component';
import { UserComponent } from './user/user.component';
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
    component: UserComponent,
    children:[
      {
        path: 'info',
        component: InfoUserComponent,
      },
      {
        path: "pack-of-data",
        data: {
          breadcrumb: 'pack-of-data'
        },
        loadChildren: () => import('./components/pack-of-data/pack-of-data.module').then(m => m.PackOfDataModule)
      },
      {
        path: 'notification',
        component: NotificationUserComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
