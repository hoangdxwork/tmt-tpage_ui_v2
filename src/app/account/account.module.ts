import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule, TDSCheckBoxModule, TDSFormFieldModule, TDSInputModule, TDSMessageModule, TDSSpinnerModule } from 'tmt-tang-ui';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TDSInputModule,
    TDSFormFieldModule,
    TDSButtonModule,
    TDSCheckBoxModule,
    TDSMessageModule,
    TDSSpinnerModule,
    TDSSpinnerModule,
  ]
})
export class AccountModule { }
