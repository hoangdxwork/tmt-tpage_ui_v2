import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from './components/pipe/custom-currency.pipe';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { TDSSpinnerModule } from 'tmt-tang-ui';
import { PageLoadingService } from './services/page-loading.service';



@NgModule({
  declarations: [
    PageLoadingComponent,
    CustomCurrencyPipe,
  ],
  imports: [
    CommonModule,
    TDSSpinnerModule
  ],
  exports: [
    PageLoadingComponent,
    CustomCurrencyPipe
  ],
  providers: [
    PageLoadingService,
  ]
})
export class SharedModule { }
