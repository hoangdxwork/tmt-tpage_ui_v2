import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSBadgeModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSOutletModule, TDSScrollIntoViewModule, TDSSelectModule, TDSTableModule, TDSTagModule, TDSTypographyModule, TDSUploadModule } from 'tmt-tang-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';
import { TpageBaseComponent } from './tpage-base/tpage-base.component';
import { TpageAvatarFacebookComponent } from './tpage-avatar-facebook/tpage-avatar-facebook.component';
import { TpageMenuLayoutComponent } from './tpage-menu-layout/tpage-menu-layout.component';
import { TpageMenuItemComponent } from './tpage-menu-item/tpage-menu-item.component';
import { SendMessageComponent } from './tpage-send-message/send-message.component';
import { PipeModule } from './pipe/pipe.module';
import { BrowserModule } from '@angular/platform-browser';
import { TpageCheckAddressComponent } from './tpage-check-address/tpage-check-address.component';
import { TpageAddProductComponent } from './tpage-add-product/tpage-add-product.component';
import { TpageAddCategoryComponent } from './tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from './tpage-search-uom/tpage-search-uom.component';
import { TpageAddUOMComponent } from './tpage-add-uom/tpage-add-uom.component';
import { ListProductTmpComponent } from './list-product-tmp/list-product-tmp.component';
import { SharedService } from '../services/shared.service';
import { ProductIndexDBService } from '../services/product-indexDB.service';

const cmp =[
  TpageTeamDropdownComponent,
  TpageBaseComponent,
  TpageAvatarFacebookComponent,
  TpageMenuLayoutComponent,
  SendMessageComponent,
  TpageCheckAddressComponent,
  TpageMenuItemComponent,
  TpageAddProductComponent,
  TpageAddCategoryComponent,
  TpageSearchUOMComponent,
  TpageAddUOMComponent,
  ListProductTmpComponent
]

const SERVICES = [
  ProductIndexDBService,
  SharedService
]

@NgModule({
  declarations: [
    ...cmp
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TDSAvatarModule,
    TDSCollapseModule,
    TDSDropDownModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSButtonModule,
    TDSModalModule,
    ReactiveFormsModule,
    TDSSelectModule,
    TDSInputNumberModule,
    TDSCheckBoxModule,
    TDSTableModule,
    TDSBadgeModule,
    TDSTagModule,
    TDSTypographyModule,
    TDSUploadModule,
    TDSTypographyModule
  ],
  exports:[
   ...cmp
  ],
  providers: [
    ...SERVICES,
   ],
})
export class MainSharedModule { }
