import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Đa ngôn ngữ
import localeVi from '@angular/common/locales/vi';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { TAuthGuardService, TAuthInterceptorService } from './lib';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDS_I18N, vi_VN } from 'tds-ui/i18n';
import { environment } from 'src/environments/environment';
import { TDSNotificationModule } from 'tds-ui/notification';
import { PipeModule } from '@app/shared/pipe/pipe.module';
import { TDSMessageModule } from 'tds-ui/message';

// Thiết lập tiếng Việt
registerLocaleData(localeVi);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScrollingModule,
    HttpClientModule,
    SharedModule,
    TDSNotificationModule,
    PipeModule,
    TDSMessageModule
  ],
  providers: [{ provide: TDS_I18N, useValue: vi_VN },
    TAuthGuardService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TAuthInterceptorService, multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],

  bootstrap: [AppComponent]
})

export class AppModule {}
