import { ReportOverviewPipe } from './reportOverview.pipe';
import { TruncateStringPipe } from './truncate-string.pipe';
import { SortDataSourceMessagePipe, SortDataSourcePostPipe } from './sort-dataSource-post.pipe';
import { ConvertToCRMTagsListPipe } from './convert-to-CRMTagList.pipe';
import { ChatomniFacebookType, ChatomniTShopType, ChatomniTShopData, ChatomniFacebookData } from './fb-post-type.pipe';
import { GetStatusNamePipe } from './get-status-name.pipe';
import { SelectMultipleValuePipe } from './select-multiple-value.pipe';
import { ConvertListUrlPipe } from './convert-list-url.pipe';
import { ButtonStatusColorPipe } from './button-status-color.pipe';
import { ReplacePartnerPipe } from './replace-partner.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrettyjsonPipe } from './prettyjson.pipe';
import { PartnerColorPipe } from './partner-color.pipe';
import { FieldChannelPipe } from './field-channel.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { YiDiffDateTimePipe } from './yi-diff-datetime.pipe';
import { ShowAvatarPipe } from './show-avatar.pipe';
import { FormatIconLikePipe } from './format-icon-like.pipe';
import { YiDateTimeV3Pipe } from './yi-datetimeV3.pipe';
import { YiDateTimeFormatPipe } from './yi-datetimeV2.pipe';
import { ScrollConversationPipe } from './scroll-conversation.pipe';
import { OrderByPipe } from './order-by.pipe';
import { ShowAttributeValuePipe } from './show-attribute-value.pipe';
import { NameNetWorkPipe } from './name-network.pipe';
import { NumberCustomPipe } from './number-custom.pipe';
import { CompareToday } from './compare-today.pipe';
import { StringToStringArrayPipe } from './string-stringArray.pipe';
import { TagStatusColorPipe } from './tag-status-color.pipe';
import { CheckTagSelectedCommnetPipe, CheckTagSelectedPipe, IndexSimpleDetailLiveCampainPipe } from './check-tag-selected.pipe';
import { ConverseTimePipe } from './converse-time.pipe';
import { BBcodeConvertPipe } from './bbcode-convert.pipe';
import { LatestMessageTypePipe } from './lastest-message-type.pipe';
import { NumericalOrder } from './numerical-order.pipe';
import { jsonPayloadPipe } from './json-payload.pipe';
import { GetShowStatePipe } from './get-show-state.pipe';
import { getColorStatusShowStatePipe, GetColorStatusStatePipe, GetOrderStatusPipe, GetColorStatusTextPipe, GetColorShowConfigPipe } from './get-order-status.pipe';
import { OnSetWidthTagPipe } from './set-width-tagpipe';
import { AvatarRandomPipe, GetAvatarCarrier, RandomColorPipe } from './get-avatar-carrier.pipe';
import { HighlightSearchPipe } from './highlightSearch.pipe';
import { SimpleSearchPipe, SimpleSearchV2Pipe, SimpleSearchLiveCampaignDetailPipe, SimpleSearchQuickRepplyPipe } from './simple-search.pipe';
import { ReduceSystemMessagePipe } from './reduce-system-message.pipe';
import { SeenedMessagePipe } from './coversation-message.pipe';
import { FilterIndexDBLivePipe } from './filter-indexdb-live.pipe';
import { FirebaseSubscribedPipe } from './firebase-subscribed.pipe';

const cmp =[
  PrettyjsonPipe,
  PartnerColorPipe,
  FieldChannelPipe,
  SafeHtmlPipe,
  YiDiffDateTimePipe,
  ShowAvatarPipe,
  FormatIconLikePipe,
  YiDateTimeV3Pipe,
  YiDateTimeFormatPipe,
  ScrollConversationPipe,
  ReplacePartnerPipe,
  OrderByPipe,
  ButtonStatusColorPipe,
  ShowAttributeValuePipe,
  ConvertListUrlPipe,
  SelectMultipleValuePipe,
  NameNetWorkPipe,
  NumberCustomPipe,
  CompareToday,
  GetStatusNamePipe,
  GetOrderStatusPipe,
  StringToStringArrayPipe,
  TagStatusColorPipe,
  CheckTagSelectedPipe,
  ChatomniTShopType,
  ChatomniFacebookType,
  ChatomniTShopData,
  ChatomniFacebookData,
  ConverseTimePipe,
  ConvertToCRMTagsListPipe,
  BBcodeConvertPipe,
  SortDataSourcePostPipe,
  SortDataSourceMessagePipe,
  CheckTagSelectedCommnetPipe,
  LatestMessageTypePipe,
  ReportOverviewPipe,
  NumericalOrder,
  jsonPayloadPipe,
  GetShowStatePipe,
  getColorStatusShowStatePipe,
  GetColorStatusStatePipe,
  GetColorStatusTextPipe,
  TruncateStringPipe,
  OnSetWidthTagPipe,
  GetAvatarCarrier,
  HighlightSearchPipe,
  GetColorShowConfigPipe,
  SimpleSearchPipe,
  SimpleSearchV2Pipe,
  SimpleSearchLiveCampaignDetailPipe,
  AvatarRandomPipe,
  RandomColorPipe,
  SimpleSearchQuickRepplyPipe,
  ReduceSystemMessagePipe,
  SeenedMessagePipe,
  IndexSimpleDetailLiveCampainPipe,
  FilterIndexDBLivePipe,
  FirebaseSubscribedPipe
]

@NgModule({
    declarations: [
      ...cmp,
    ],
    imports: [
      CommonModule,
      FormsModule,

    ],
    exports:[
    ...cmp
    ]
})

export class PipeModule {}
