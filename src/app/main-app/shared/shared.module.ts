import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule, TDSBadgeModule, TDSButtonModule, TDSCheckBoxModule, TDSCollapseModule, TDSDropDownModule, TDSFormFieldModule, TDSInputModule, TDSInputNumberModule, TDSModalModule, TDSOutletModule, TDSScrollIntoViewModule, TDSSelectModule, TDSSpinnerModule, TDSTableModule, TDSTabsModule, TDSTagModule, TDSTypographyModule, TDSUploadModule, TDSImageModule, TDSToolTipModule, TDSDatePickerModule, TDSPopoverModule } from 'tmt-tang-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';
import { TpageBaseComponent } from './tpage-base/tpage-base.component';
import { TpageAvatarFacebookComponent } from './upload-image/tpage-avatar-facebook/tpage-avatar-facebook.component';
import { TpageMenuLayoutComponent } from './tpage-menu-layout/tpage-menu-layout.component';
import { TpageMenuItemComponent } from './tpage-menu-item/tpage-menu-item.component';
import { SendMessageComponent } from './tpage-send-message/send-message.component';
import { PipeModule } from './pipe/pipe.module';
import { BrowserModule } from '@angular/platform-browser';
import { TpageAddProductComponent } from './tpage-add-product/tpage-add-product.component';
import { TpageAddCategoryComponent } from './tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from './tpage-search-uom/tpage-search-uom.component';
import { TpageAddUOMComponent } from './tpage-add-uom/tpage-add-uom.component';
import { ListProductTmpComponent } from './list-product-tmp/list-product-tmp.component';
import { SharedService } from '../services/shared.service';
import { ProductIndexDBService } from '../services/product-indexDB.service';
import { SuggestAddressComponent } from './suggest-address/suggest-address.component';
import { SuggestAddressService } from '../services/suggest-address.service';
import { ImageFacade } from '../services/facades/image.facade';
import { TpageAvatarGroupFacebookComponent } from './tpage-avatar-group-facebook/tpage-avatar-group-facebook.component';
import { TpageUploadAvatarComponent } from './tpage-upload-avatar/tpage-upload-avatar.component';
import { UploadImageModule } from './upload-image/tpage-avatar-facebook/upload-image.module';
import { TpageConfigProductComponent } from './tpage-config-product/tpage-config-product.component';
import { ProductPriceListService } from '../services/product-price-list.service';
import { TpageConversationAddressComponent } from './tpage-conversation-address/tpage-conversation-address.component';
import { UploadPicturesWallComponent } from './upload-wall/upload-pictures-wall.component';
import { ListLiveCampaignComponent } from './list-live-campaign/list-live-campaign.component';
import { OdataLiveCampaignService } from '../services/mock-odata/odata-live-campaign.service';
import { AddLiveCampaignComponent } from './add-live-campaign/add-live-campaign.component';
import { OverviewLiveCampaignComponent } from './overview-live-campaign/overview-live-campaign.component';
import { FastSaleOrderLineService } from '../services/fast-sale-orderline.service';
import { QuickReplyButtonComponent } from './quick-reply-button/quick-reply-button.component';

const cmp =[
  TpageTeamDropdownComponent,
  TpageBaseComponent,
  TpageMenuLayoutComponent,
  SendMessageComponent,
  SuggestAddressComponent,
  TpageMenuItemComponent,
  TpageAddProductComponent,
  TpageAddCategoryComponent,
  TpageSearchUOMComponent,
  TpageAddUOMComponent,
  ListProductTmpComponent,
  TpageAvatarGroupFacebookComponent,
  TpageUploadAvatarComponent,
  TpageConfigProductComponent,
  TpageConversationAddressComponent,
  UploadPicturesWallComponent,
  ListLiveCampaignComponent,
  AddLiveCampaignComponent,
  QuickReplyButtonComponent,
]

const SERVICES = [
  ProductIndexDBService,
  SuggestAddressService,
  SharedService,
  ImageFacade,
  ProductPriceListService,
  OdataLiveCampaignService,
  FastSaleOrderLineService,
]

@NgModule({
  declarations: [
    ...cmp,
    OverviewLiveCampaignComponent
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
    TDSTypographyModule,
    TDSSpinnerModule,
    TDSTabsModule,
    PipeModule,
    UploadImageModule,
    TDSImageModule,
    TDSToolTipModule,
    TDSDatePickerModule,
    TDSPopoverModule
  ],
  exports:[
   ...cmp
  ],
  providers: [
    ...SERVICES,
   ],
})
export class MainSharedModule { }
