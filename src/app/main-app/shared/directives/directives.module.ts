import { CsLoadingOrderDirective } from './cs-loading-order.directive';
import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { CsLoadingPostDirective } from './cs-loading-post.directive';
import { CsLoadingObjectDirective } from './cs-loading-object.directive';
import { TDSSkeletonModule } from 'tds-ui/skeleton';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PipeModule } from "../pipe/pipe.module";
import { ShowMoreDirective } from "./show-more.directive";
import { YiAutoScrollDirective } from "./yi-auto-scroll.directive";
import { YuriAvatarDirective } from "./yuri-avatar.directive";
import { CsLoadingPartnerDirective } from './cs-loading-partner.directive';
import { CsLoadingConversationDirective } from './cs-loading-conversation.directive';
import { ShowMoreDirectiveV2 } from './show-more-v2.directive';

const DIRECTIVES = [
  YiAutoScrollDirective,
  YuriAvatarDirective,
  ShowMoreDirective,
  ShowMoreDirectiveV2,
  CsLoadingObjectDirective,
  CsLoadingPostDirective,
  CsLoadingPartnerDirective,
  CsLoadingConversationDirective,
  CsLoadingOrderDirective
]

@NgModule({
  imports: [
    CommonModule,
    TDSSkeletonModule,
    TDSSpinnerModule,
    PipeModule
  ],
  exports: [...DIRECTIVES],
  declarations: [...DIRECTIVES]
})

export class DirectivesModule {
}
