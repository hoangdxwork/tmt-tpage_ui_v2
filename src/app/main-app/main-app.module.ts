import { ChangeDetectorRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainAppRoutingModule } from './main-app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainSharedModule } from './shared/shared.module';
import { PipeModule } from './shared/pipe/pipe.module';

import { UploadImageModule } from './shared/upload-image/tpage-avatar-facebook/upload-image.module';
// import { ProductDataFacade } from './services/facades/product.data.facade';
import { DirectivesModule } from './shared/directives/directives.module';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSMenuModule } from 'tds-ui/menu';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSFlexModule } from 'tds-ui/flex';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSMessageModule } from 'tds-ui/message';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSNotificationModule } from 'tds-ui/notification';
import { TDSTagModule } from 'tds-ui/tag';

// const SERVICES = [
//   // ProductDataFacade,
// ]

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
    DirectivesModule,
    TDSTagModule,
  ],
  providers:[
    // ...SERVICES,
  ]
})
export class MainAppModule { }
