import { TDSEmptyModule } from 'tds-ui/empty';
import { ShowAttachmentComponent } from './show-attachment/show-attachment.component';
import { NotificationEventSocketComponent } from './notification-event-socket/notification-event-socket.component';
import { TableDetailReportComponent } from './table-detail-report/table-detail-report.component';
import { TDSSwitchModule } from 'tds-ui/switch';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TpageTeamDropdownComponent } from './tpage-team-dropdown/tpage-team-dropdown.component';
import { TpageBaseComponent } from './tpage-base/tpage-base.component';
import { TpageMenuLayoutComponent } from './tpage-menu-layout/tpage-menu-layout.component';
import { TpageMenuItemComponent } from './tpage-menu-item/tpage-menu-item.component';
import { SendMessageComponent } from './tpage-send-message/send-message.component';
import { PipeModule } from './pipe/pipe.module';
import { ModalProductTemplateComponent } from './tpage-add-product/modal-product-template.component';
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
import { UploadImageModule } from './upload-image/tpage-avatar-facebook/upload-image.module';
import { TpageConfigProductComponent } from './tpage-config-product/tpage-config-product.component';
import { ProductPriceListService } from '../services/product-price-list.service';
import { UploadPicturesWallComponent } from './upload-wall/upload-pictures-wall.component';
import { ListLiveCampaignComponent } from './list-live-campaign/list-live-campaign.component';
import { ODataLiveCampaignService } from '../services/mock-odata/odata-live-campaign.service';
import { AddLiveCampaignPostComponent } from './add-live-campaign/add-livecampaign-post.component';
import { OverviewLiveCampaignComponent } from './overview-live-campaign/overview-live-campaign.component';
import { FastSaleOrderLineService } from '../services/fast-sale-orderline.service';
import { QuickReplyButtonComponent } from './quick-reply-button/quick-reply-button.component';
import { BillFilterOptionsComponent } from './bill-filter-options/bill-filter-options.component';
import { TpageNotificationDropdownComponent } from './tpage-notification-dropdown/tpage-notification-dropdown.component';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSTableModule } from 'tds-ui/table';
import { TDSBadgeModule } from 'tds-ui/badges';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSUploadModule } from 'tds-ui/upload';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { TDSImageModule } from 'tds-ui/image';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSPopoverModule } from 'tds-ui/popover';
import { TDSMessageModule, TDSMessageService } from 'tds-ui/message';
import { DirectivesModule } from './directives/directives.module';
import { SuggestAddressV2Component } from './suggest-address-v2/suggest-address-v2.component';
import { TDSAlertModule } from 'tds-ui/alert';

const cmp =[
  TpageTeamDropdownComponent,
  TpageBaseComponent,
  TpageMenuLayoutComponent,
  SendMessageComponent,
  SuggestAddressComponent,
  TpageMenuItemComponent,
  ModalProductTemplateComponent,
  TpageAddCategoryComponent,
  TpageSearchUOMComponent,
  TpageAddUOMComponent,
  ListProductTmpComponent,
  TpageAvatarGroupFacebookComponent,
  TpageConfigProductComponent,
  UploadPicturesWallComponent,
  ListLiveCampaignComponent,
  AddLiveCampaignPostComponent,
  QuickReplyButtonComponent,
  OverviewLiveCampaignComponent,
  BillFilterOptionsComponent,
  TpageNotificationDropdownComponent,
  TableDetailReportComponent,
  SuggestAddressV2Component,
  NotificationEventSocketComponent,
  ShowAttachmentComponent,
]

const SERVICES = [
  ProductIndexDBService,
  SuggestAddressService,
  SharedService,
  ImageFacade,
  ProductPriceListService,
  ODataLiveCampaignService,
  FastSaleOrderLineService,
  TDSMessageService
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
    TDSTypographyModule,
    TDSSpinnerModule,
    TDSTabsModule,
    PipeModule,
    UploadImageModule,
    TDSImageModule,
    TDSToolTipModule,
    TDSDatePickerModule,
    TDSPopoverModule,
    TDSMessageModule,
    DirectivesModule,
    TDSSwitchModule,
    TDSEmptyModule,
    TDSAlertModule,
  ],
  exports:[
   ...cmp
  ],
  providers: [
    ...SERVICES,
   ],
})
export class MainSharedModule { }
