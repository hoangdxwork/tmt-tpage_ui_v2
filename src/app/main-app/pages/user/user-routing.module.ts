import { InfoUserComponent } from './components/info-user/info-user.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackOfDataComponent } from './pack-of-data/pack-of-data.component';
import { NotificationComponent } from './notification/notification.component';
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
        path: 'pack-of-data',
        component: PackOfDataComponent
      },
      {
        path: 'notification',
        component: NotificationComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
