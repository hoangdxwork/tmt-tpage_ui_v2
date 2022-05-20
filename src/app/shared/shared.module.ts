import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { TDSSpinnerModule } from 'tmt-tang-ui';
import { PageLoadingService } from './services/page-loading.service';
import { PageErrorComponent } from './components/error/page-error.component';

@NgModule({
  declarations: [
    PageLoadingComponent,
    PageErrorComponent
  ],
  imports: [
    CommonModule,
    TDSSpinnerModule
  ],
  exports: [
    PageLoadingComponent,
    PageErrorComponent
  ],
  providers: [
    PageLoadingService,
  ]
})
export class SharedModule { }
