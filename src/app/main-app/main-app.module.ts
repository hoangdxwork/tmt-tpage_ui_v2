import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainAppRoutingModule } from './main-app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainSharedModule } from './shared/shared.module';
import { PipeModule } from './shared/pipe/pipe.module';
import { TDSUploadModule } from "tmt-tang-ui";

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
  TDSModalModule,
  TDSNotificationModule,
  TDSSelectModule,
  TDSToolTipModule,
} from 'tmt-tang-ui';
import { UploadImageModule } from './shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { ProductDataFacade } from './services/facades/product.data.facade';
import { DirectivesModule } from './shared/directives/directives.module';

const SERVICES = [
  ProductDataFacade,
]

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
    TDSMessageModule,
    PipeModule,
    TDSModalModule,
    TDSNotificationModule,
    UploadImageModule,
    TDSToolTipModule,
    TDSUploadModule,
    DirectivesModule
  ],
  providers:[
    ...SERVICES,
  ]
})
export class MainAppModule { }
