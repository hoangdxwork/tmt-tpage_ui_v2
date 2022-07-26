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
import { LastActivityMessagePipe } from './last-activity-message.pipe';
import { ShowAttributeValuePipe } from './show-attribute-value.pipe';
import { NameNetWorkPipe } from './name-network.pipe';
import { NumberCustomPipe } from './number-custom.pipe';
import { CompareToday } from './compare-today.pipe';
import { StringToStringArrayPipe } from './string-stringArray.pipe';

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
  LastActivityMessagePipe,
  ShowAttributeValuePipe,
  ConvertListUrlPipe,
  SelectMultipleValuePipe,
  NameNetWorkPipe,
  NumberCustomPipe,
  CompareToday,
  GetStatusNamePipe,
  StringToStringArrayPipe
]

@NgModule({
    declarations: [
      ...cmp,
    ],
    imports: [
      CommonModule,
      FormsModule
    ],
    exports:[
    ...cmp
    ]
})

export class PipeModule {}
