import { OrderModule } from './main-app/pages/order/order.module';
import { MainSharedModule } from './main-app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Đa ngôn ngữ
import localeVi from '@angular/common/locales/vi';
import {  HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { TAuthGuardService, TAuthInterceptorService } from './lib';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDS_I18N, vi_VN } from 'tds-ui/i18n';
import { TDSNotificationModule } from 'tds-ui/notification';
import { PipeModule } from '@app/shared/pipe/pipe.module';
import { TDSMessageModule } from 'tds-ui/message';
import { QuillModule } from 'ngx-quill';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { TDSButtonModule } from "tds-ui/button";

import "quill-mention";
import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
firebase.initializeApp(environment.firebaseConfig)

const atValues = [
  { id: 1, value: "Họ & tên" },
  { id: 2, value: "Điện thoại" }
];
const hashValues = [
  { id: 3, value: "Địa chỉ" },
  { id: 4, value: "Đơn hàng" }
];

export const quillOptions = {
  suppressGlobalRegisterWarning: true,
  modules: {
    mention: {
      allowedChars: /^\w*$/,
      mentionDenotationChars: ["@", "#"],
      source: function (searchTerm: string, renderList: (arg0: { id: number; value: string; }[], arg1: any) => void, mentionChar: string) {
        let values;

        if (mentionChar === "@") {
          values = atValues;
        } else {
          values = hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      }
    } as any
  } as any
};

// Thiết lập tiếng Việt
registerLocaleData(localeVi);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    TDSMessageModule,
    MainSharedModule,
    OrderModule,
    TDSButtonModule,
    QuillModule.forRoot(quillOptions),
    AngularFireAuthModule,
    AngularFireMessagingModule
  ],
  providers: [{ provide: TDS_I18N, useValue: vi_VN },
    TAuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TAuthInterceptorService,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],

  bootstrap: [AppComponent]
})

export class AppModule {}
