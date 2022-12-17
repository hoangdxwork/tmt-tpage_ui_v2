import { TDSSpinnerModule } from 'tds-ui/progress-spinner';
import { CsLoadingPostDirective } from './cs-loading-post.directive';
import { CsLoadingObjectDirective } from './cs-loading-object.directive';
import { CsLoadingPartnerDirective } from './cs-loading-partner.directive';
import { TDSSkeletonModule } from 'tds-ui/skeleton';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PipeModule } from "../pipe/pipe.module";
import { ShowMoreDirective } from "./show-more.directive";
import { YiAutoScrollDirective } from "./yi-auto-scroll.directive";
import { YuriAvatarDirective } from "./yuri-avatar.directive";

const DIRECTIVES = [
  YiAutoScrollDirective,
  YuriAvatarDirective,
  ShowMoreDirective,
  CsLoadingPartnerDirective,
  CsLoadingObjectDirective,
  CsLoadingPostDirective
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
