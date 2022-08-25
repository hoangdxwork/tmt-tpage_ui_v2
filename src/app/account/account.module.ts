import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSMessageModule } from 'tds-ui/message';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';

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
    TDSSpinnerModule
  ]
})

export class AccountModule { }
