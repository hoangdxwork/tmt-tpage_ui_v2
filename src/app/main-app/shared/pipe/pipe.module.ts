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
import { SplitCommaPipe } from './split-comma.pipe';

const cmp =[
  PrettyjsonPipe,
  PartnerColorPipe,
  FieldChannelPipe,
  SafeHtmlPipe,
  YiDiffDateTimePipe,
  ShowAvatarPipe,
  SplitCommaPipe,
  FormatIconLikePipe,
  YiDateTimeV3Pipe,
  YiDateTimeFormatPipe,
  ScrollConversationPipe,
  ReplacePartnerPipe
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
