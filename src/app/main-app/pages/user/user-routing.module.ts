import { InfoUserComponent } from './components/info-user/info-user.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackOfDataComponent } from './pack-of-data/pack-of-data.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { FirebaseNotificationComponent } from './firebase-notification/firebase-notification.component';
import { ActivitiesComponent } from './activities/activities.component';
import { SocketNotificationComponent } from './socket-notification/socket-notification.component';
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
      },
      {
        path:'notification/:id',
        component: NotificationDetailComponent
      },
      {
        path:'firebase-notification',
        component: FirebaseNotificationComponent
      },
      {
        path:'activities',
        component: ActivitiesComponent
      },
      {
        path:'socket-notification',
        component: SocketNotificationComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
