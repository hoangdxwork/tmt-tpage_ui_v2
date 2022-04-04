
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrettyjsonPipe } from './prettyjson.pipe';
import { PartnerColorPipe } from './partner-color.pipe';

const cmp =[
  PrettyjsonPipe,
  PartnerColorPipe
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
