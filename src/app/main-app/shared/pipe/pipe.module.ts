
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrettyjsonPipe } from './prettyjson.pipe';
import { PartnerColorPipe } from './partner-color.pipe';
import { FieldChannelPipe } from './field-channel.pipe';
import { FormatMessagePipe } from './format-message.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { YiDiffDateTimePipe } from './yi-diff-datetime.pipe';

const cmp =[
  PrettyjsonPipe,
  PartnerColorPipe,
  FieldChannelPipe,
  FormatMessagePipe,
  SafeHtmlPipe,
  YiDiffDateTimePipe
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
