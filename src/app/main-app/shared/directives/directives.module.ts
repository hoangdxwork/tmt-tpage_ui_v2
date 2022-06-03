import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { YiAutoScrollDirective } from "./yi-auto-scroll.directive";

const DIRECTIVES = [
  YiAutoScrollDirective
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
