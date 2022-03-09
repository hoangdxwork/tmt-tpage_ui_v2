import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TDSButtonModule, TDS_I18N, vi_VN } from 'tmt-tang-ui'; 
// Đa ngôn ngữ
import localeVi from '@angular/common/locales/vi'; 
import { registerLocaleData } from '@angular/common';
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
    TDSButtonModule
  ],
  providers: [{ provide: TDS_I18N, useValue: vi_VN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
