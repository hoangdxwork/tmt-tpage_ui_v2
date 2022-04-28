import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { TDSSpinnerModule } from 'tmt-tang-ui';
import { PageLoadingService } from './services/page-loading.service';

@NgModule({
  declarations: [
    PageLoadingComponent,
  ],
  imports: [
    CommonModule,
    TDSSpinnerModule
  ],
  exports: [
    PageLoadingComponent,
  ],
  providers: [
    PageLoadingService,
  ]
})
export class SharedModule { }
