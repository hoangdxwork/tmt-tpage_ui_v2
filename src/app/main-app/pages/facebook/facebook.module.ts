import { FacebookChannelV2Component } from './components/facebook-channel/facebook-channel-v2.component';
import { TDSFilterStatusModule } from 'tds-ui/filter-status';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookRoutingModule } from './facebook-routing.module';
import { FacebookComponent } from './facebook/facebook.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPageComponent } from './components/add-page/add-page.component';
import { MainSharedModule } from '../../shared/shared.module';
import { FacebookGraphService } from '../../services/facebook-graph.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { FacebookLoginService } from '../../services/facebook-login.service';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';
import { TDSPageHeaderModule } from 'tds-ui/page-header';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSAutocompleteModule } from 'tds-ui/auto-complete';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSSwitchModule } from 'tds-ui/switch';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TShopLoginComponent } from './components/tshop-login/tshop-login.component';
import { TDSTabsModule } from 'tds-ui/tabs';
import { FacebookChannelComponent } from './components/facebook-channel/facebook-channel.component';
import { TshopChannelComponent } from './components/tshop-channel/tshop-channel.component';
import { TDSEmptyModule } from 'tds-ui/empty';
import { ConvertPageComponent } from './components/convert-page/convert-page.component';

const SERVICES = [
  FacebookGraphService,
  FacebookLoginService
]

@NgModule({
  declarations: [
    FacebookComponent,
    AddPageComponent,
    TShopLoginComponent,
    FacebookChannelComponent,
    TshopChannelComponent,
    FacebookChannelV2Component,
    ConvertPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainSharedModule,
    FormsModule,
    FacebookRoutingModule,
    TDSPageHeaderModule,
    TDSBreadCrumbModule,
    TDSButtonModule,
    TDSButtonMenuModule,
    TDSDropDownModule,
    TDSAutocompleteModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSCollapseModule,
    TDSAvatarModule,
    TDSBadgeModule,
    TDSSwitchModule,
    TDSModalModule,
    PipeModule,
    TDSSpinnerModule,
    UploadImageModule,
    TDSToolTipModule,
    TDSTabsModule,
    TDSEmptyModule,
    TDSFilterStatusModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class FacebookModule { }
