import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookRoutingModule } from './facebook-routing.module';
import { FacebookComponent } from './facebook/facebook.component';


@NgModule({
  declarations: [
    FacebookComponent
  ],
  imports: [
    CommonModule,
    FacebookRoutingModule
  ]
})
export class FacebookModule { }
