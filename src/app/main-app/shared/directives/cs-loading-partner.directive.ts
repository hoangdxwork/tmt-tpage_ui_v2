import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[csLoadingPartner]',
  template: `<div class="h-full w-full flex flex-col flex-auto">
                <div class="h-full w-full flex flex-col flex-auto bg-white">
                    <div class="h-fit w-full bg-white p-4 border-b-3 border-neutral-3-200">
                        <div class="mb-4 flex gap-6">
                            <tds-skeleton-element tdsType="avatar" [tdsActive]="true"></tds-skeleton-element>
                            <div class="w-full">
                                <tds-skeleton-element
                                    tdsType="input" [tdsActive]="true"
                                    [tdsSize]="'lg'" style="width:50%">
                                </tds-skeleton-element>
                                <tds-skeleton-element
                                    tdsType="input" [tdsActive]="true"
                                    [tdsSize]="'sm'" style="width:70%">
                                </tds-skeleton-element>
                            </div>
                        </div>

                        <div>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:40%">
                            </tds-skeleton-element>
                        </div>
                        <div>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:50%">
                            </tds-skeleton-element>
                        </div>
                        <div>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:60%">
                            </tds-skeleton-element>
                        </div>
                        <tds-skeleton-element class="mr-2"
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width:40%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width:30%">
                        </tds-skeleton-element>
                        <div class="flex gap-4">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'lg'" style="width:80%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'lg'" style="width:20%">
                            </tds-skeleton-element>
                        </div>
                    </div>

                    <div class="h-fit w-full bg-white p-4 border-b-3 border-neutral-3-200">
                        <div class="mb-4 flex gap-6 border-b-2 border-neutral-3-200">
                            <tds-skeleton-element tdsType="avatar" [tdsActive]="true"></tds-skeleton-element>
                            <div class="w-full mb-2">
                                <tds-skeleton-element
                                    tdsType="input" [tdsActive]="true"
                                    [tdsSize]="'sm'" style="width:50%">
                                </tds-skeleton-element>
                                <tds-skeleton-element
                                    tdsType="input" [tdsActive]="true"
                                    [tdsSize]="'md'" style="width:70%">
                                </tds-skeleton-element>
                            </div>
                        </div>

                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width:50%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width:60%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width:50%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width:60%">
                        </tds-skeleton-element>
                    </div>

                    <div class="w-full bg-white p-4 border-b-3 border-neutral-3-200">
                        <tds-skeleton-element class="mb-4"
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width:50%">
                        </tds-skeleton-element>
                        <div class="w-full">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true" style="width: 20%;"
                                [tdsSize]="'md'" class="mr-2">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true" style="width: 30%;"
                                [tdsSize]="'md'" class="mr-2">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true" style="width: 20%;"
                                [tdsSize]="'md'">
                            </tds-skeleton-element>
                        </div>
                    </div>
                </div>
            </div>`,
})

export class CsLoadingPartnerDirective implements OnInit {
  constructor() {
  }

  ngOnInit(): void {

  }
}
