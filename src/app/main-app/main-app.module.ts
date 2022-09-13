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
import { OmnichannelConfigurationParams } from 'omnichannel/core/services';
import { OmnichannelModule } from 'omnichannel';
const omnichannel: OmnichannelConfigurationParams = {
  socketUrl: 'https://socket-tpos.dev.tmtco.org/chatomni',
  eCom: {
    app: 'tpos',
    clientId: 'hoa.tpos.vn',
    apiUrl: 'https://omni-channel-host.dev.tmtco.org',
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
      appUrl: "https://test.tpos.dev",
      authToken: "pCZHjGneWW5y-Oz5FzZV0206ae8Z8dR-EWnPi-G30x90bX_PNKtbFm4HGuGj2tRhGh0PoChQe97M2tRLLCteaMFAKYETeL7OJK_3geB2PF6AOHLj8x2G0AaplV3aOD-rol-GYM3BC4EoJnqDaRh0r4oMIcbSzcI24LvP20aZzbfB2_fyHoHMY872i4MxzrsPcy1YftDQN-jC76PRsPlkkmnMWB7kDyDrRRdwEMYbkrbuy3qGIi27sSG8uayurjpD3MW7u-t2Uk8Yw1AePFxonJmd1P90sAv88p53lTWb8u6VRpoPhpZCExj622ZjYq4v7kIPGjwWZdtI6zpw7rxJOQaEpTCKV14OIwp-cL1X0ZdWmkc6PH6EfRZmDKkIPqH3PT8nGerwCkYDfliB89tunKF3nsLaDaOqgoKKBdd0iAdWJajlK6N89l0jrjD62Ffutof9t1nt6UzJ6ioKs8GuJOo_Y6abGrthYzrFo6jDsp8XIckb"
  }
}
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
    OmnichannelModule.forRoot(omnichannel),
  ],
  providers:[
    // ...SERVICES,
  ]
})
export class MainAppModule { }
