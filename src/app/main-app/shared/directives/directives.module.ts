import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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
  ],
  exports: [...DIRECTIVES],
  declarations: [...DIRECTIVES]
})

export class DirectivesModule {
}
