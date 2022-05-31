import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookRoutingModule } from './facebook-routing.module';
import { FacebookComponent } from './facebook/facebook.component';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBadgeModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSModalModule, TDSPageHeaderModule, TDSSpinnerModule, TDSSwitchModule, TDSToolTipModule } from 'tmt-tang-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPageComponent } from './components/add-page/add-page.component';
import { MainSharedModule } from '../../shared/shared.module';
import { FacebookGraphService } from '../../services/facebook-graph.service';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { FacebookLoginService } from '../../services/facebook-login.service';
import { UploadImageModule } from '../../shared/upload-image/tpage-avatar-facebook/upload-image.module';

const SERVICES = [
  FacebookGraphService,
  FacebookLoginService
]

@NgModule({
  declarations: [
    FacebookComponent,
    AddPageComponent
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
    TDSToolTipModule
  ],
  providers: [
    ...SERVICES,
  ],
})
export class FacebookModule { }
