import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { PageLoadingService } from './services/page-loading.service';
import { PageErrorComponent } from './components/error/page-error.component';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';

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
