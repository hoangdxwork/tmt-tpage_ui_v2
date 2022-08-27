import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PipeModule } from "../pipe/pipe.module";
import { ShowMoreDirective } from "./show-more.directive";
import { YiAutoScrollDirective } from "./yi-auto-scroll.directive";
import { YuriAvatarDirective } from "./yuri-avatar.directive";

const DIRECTIVES = [
  YiAutoScrollDirective,
  YuriAvatarDirective,
  ShowMoreDirective
]

@NgModule({
  imports: [
    CommonModule,
    PipeModule
  ],
  exports: [...DIRECTIVES],
  declarations: [...DIRECTIVES]
})

export class DirectivesModule {
}
