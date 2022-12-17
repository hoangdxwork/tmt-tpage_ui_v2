import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: '[csLoadingPartner]',
  template: `<div class="w-full h-full flex flex-col bg-neutral-3-200">
  <div class="h-fit w-full bg-white p-4 mb-1">
      <div class="flex flex-row items-center gap-x-4 mb-4">
          <tds-skeleton-element tdsType="avatar" [tdsActive]="true"></tds-skeleton-element>
          <div class="flex flex-col gap-y-2">
              <tds-skeleton-element
                  tdsType="input" [tdsActive]="true"
                  [tdsSize]="'sm'" style="width:300px">
              </tds-skeleton-element>
              <tds-skeleton-element
                  tdsType="input" [tdsActive]="true"
                  [tdsSize]="'sm'" style="width:200px">
              </tds-skeleton-element>
          </div>
      </div>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:300px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:350px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:400px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:500px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:500px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:500px">
      </tds-skeleton-element>
  </div>

  <div class="h-fit w-full bg-white p-4 mb-1">
      <div class="flex flex-row items-center gap-x-4 mb-4">
          <tds-skeleton-element
              tdsType="button" [tdsActive]="true"
              [tdsSize]="'lg'" [tdsShape]="'round'"></tds-skeleton-element>
          <div class="flex flex-col gap-y-2">
              <tds-skeleton-element
                  tdsType="input" [tdsActive]="true"
                  [tdsSize]="'sm'" style="width:300px">
              </tds-skeleton-element>
              <tds-skeleton-element
                  tdsType="input" [tdsActive]="true"
                  [tdsSize]="'sm'" style="width:350px">
              </tds-skeleton-element>
          </div>
      </div>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:400px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:400px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:400px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:400px">
      </tds-skeleton-element>
  </div>

  <div class="h-fit w-full bg-white p-4 mb-1">
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:300px">
      </tds-skeleton-element>
      <tds-skeleton-element
          tdsType="input" [tdsActive]="true"
          [tdsSize]="'sm'" style="width:500px">
      </tds-skeleton-element>
  </div>

  <div class="flex flex-auto bg-white p-4"></div>
</div>`,
})
export class CsLoadingPartnerDirective implements OnInit, OnChanges {

    @Input() loading!: boolean;

    constructor() {
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["loading"] && !changes["loading"].firstChange) {
           
        }
    }

    ngOnInit(): void { 
     
    }
}
