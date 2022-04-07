import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookRoutingModule } from './facebook-routing.module';
import { FacebookComponent } from './facebook/facebook.component';
import { TDSAutocompleteModule, TDSAvatarModule, TDSBadgeModule, TDSBreadCrumbModule, TDSButtonMenuModule, TDSButtonModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSModalModule, TDSPageHeaderModule, TDSSwitchModule } from 'tmt-tang-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPageComponent } from './components/add-page/add-page.component';


@NgModule({
  declarations: [
    FacebookComponent,
    AddPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    TDSModalModule
  ]
})
export class FacebookModule { }
