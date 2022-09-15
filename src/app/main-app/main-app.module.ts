import { environment } from 'src/environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TAuthService } from './../lib/services/auth.service';
import { ChangeDetectorRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainAppRoutingModule } from './main-app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainSharedModule } from './shared/shared.module';
import { PipeModule } from './shared/pipe/pipe.module';

import { UploadImageModule } from './shared/upload-image/tpage-avatar-facebook/upload-image.module';
// import { ProductDataFacade } from './services/facades/product.data.facade';
import { DirectivesModule } from './shared/directives/directives.module';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSMenuModule } from 'tds-ui/menu';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSFlexModule } from 'tds-ui/flex';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSMessageModule } from 'tds-ui/message';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSNotificationModule } from 'tds-ui/notification';
import { TDSTagModule } from 'tds-ui/tag';
import { OmnichannelConfigurationParams, OMNI_CONFIG } from 'omnichannel/core/services';
import { BaseHelper } from './shared/helper/base.helper';

// The Factory function
const omniConfigFactory = (authService: TAuthService): OmnichannelConfigurationParams => {
  const clientId = BaseHelper.getClientId();
  const appUrl = BaseHelper.getBaseApi();
  let authToken = authService.getAccessToken().access_token;
  return {
      socketUrl: environment.socketUrl,
      eCom: {
          app: 'tpos',
          clientId: clientId,
          apiUrl: appUrl,
          tiktokShop: {
              eChannel: 0,
              appKey: '4l89pg',
              appSecret: '2c9d1a45484d0d171a995814ee0b5b12b1d02820',
          },
          lazada: {
              eChannel: 1,
          },
          tiki: {
              eChannel: 2,
          },
          shopee: {
              eChannel: 3,
          }
      },
      tposApp: {
          appUrl: appUrl,
          authToken: authToken
      }
  }
};
@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainAppRoutingModule,
    MainSharedModule,
    TDSMenuModule,
    TDSButtonModule,
    TDSFlexModule,
    TDSHeaderModule,
    TDSSelectModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSAvatarModule,
    TDSDropDownModule,
    TDSMessageModule,
    PipeModule,
    TDSModalModule,
    TDSNotificationModule,
    UploadImageModule,
    TDSToolTipModule,
    TDSUploadModule,
    DirectivesModule,
    TDSTagModule,
  ],
  providers:[
    // ...SERVICES,
    { provide: OMNI_CONFIG, useFactory: omniConfigFactory,
      deps: [TAuthService]
    },
  ]
})
export class MainAppModule { }
