import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule, TDSCheckBoxModule, TDSFormFieldModule, TDSInputModule, TDSMessageModule, TDSSpinnerModule } from 'tmt-tang-ui';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent
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
  ]
})
export class AccountModule { }
