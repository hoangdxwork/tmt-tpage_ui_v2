import { ScrollingModule } from '@angular/cdk/scrolling';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TDSButtonModule, TDS_I18N, vi_VN } from 'tmt-tang-ui';
// Đa ngôn ngữ
import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { TAuthGuardService, TAuthInterceptorService } from './lib';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { SignalRConnectionService } from './main-app/services/signalR/signalR-connection.service';
// Thiết lập tiếng Việt
registerLocaleData(localeVi);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ScrollingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [{ provide: TDS_I18N, useValue: vi_VN },
    TAuthGuardService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TAuthInterceptorService, multi: true
  },
  // SignalRConnectionService,
  // {
  //     provide: APP_INITIALIZER,
  //     useFactory: (signalrService: SignalRConnectionService) => () => signalrService.initiateSignalRConnection(),
  //     deps: [SignalRConnectionService],
  //     multi: true,
  // }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
