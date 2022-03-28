import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainAppRoutingModule } from './main-app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainSharedModule } from './shared/shared.module';

import {
  TDSAvatarModule,
  TDSButtonModule,
  TDSDropDownModule,
  TDSFlexModule,
  TDSFormFieldModule,
  TDSHeaderModule,
  TDSInputModule,
  TDSMenuModule,
  TDSMessageModule,
  TDSSelectModule
} from 'tmt-tang-ui';

import { PipeModule } from './shared/pipe/pipe.module';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainAppRoutingModule,
    MainSharedModule,
    TDSMenuModule,
    TDSButtonModule,
    TDSFlexModule,
    TDSHeaderModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSAvatarModule,
    TDSDropDownModule,
    TDSMessageModule ,
    PipeModule
  ],
  providers:[
    // TAuthGuardService
  ]
})
export class MainAppModule { }
