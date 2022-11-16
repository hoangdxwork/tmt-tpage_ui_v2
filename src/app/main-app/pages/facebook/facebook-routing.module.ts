import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TShopLoginComponent } from './components/tshop-login/tshop-login.component';
import { FacebookComponent } from './facebook/facebook.component';

const routes: Routes = [
  {
    path: '',
    component: FacebookComponent
  },
  {
    path: 'tshop-login',
    component: TShopLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookRoutingModule { }
