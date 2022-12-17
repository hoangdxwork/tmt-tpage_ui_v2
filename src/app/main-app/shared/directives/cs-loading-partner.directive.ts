import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[csLoadingPartner]',
  template: `<div class="h-full w-full flex flex-col flex-auto">
                <div class="h-full w-full flex flex-col flex-auto bg-neutral-3-200">
                    <div class="h-fit w-full bg-white p-4 mb-1">
                        <div class="mb-4">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'md'" style="width:40%">
                            </tds-skeleton-element>
                        </div>
                        <div class="mb-4">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:40%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:40%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:40%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:60%">
                            </tds-skeleton-element>
                        </div>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width:40%">
                        </tds-skeleton-element>
                    </div>

                    <div class="h-fit w-full bg-white p-4 mb-1">
                        <div class="mb-4">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'md'" style="width:60%">
                            </tds-skeleton-element>
                        </div>
                        <div class="mb-4">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:70%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'lg'" style="width:70%">
                            </tds-skeleton-element>
                        </div>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width:70%">
                        </tds-skeleton-element>
                    </div>

                    <div class="h-fit w-full bg-white p-4 mb-1">
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width:70%">
                        </tds-skeleton-element>
                    </div>

                    <div class="h-fit w-full bg-white p-4 mb-1">
                        <tds-skeleton-element
                            tdsType="button" [tdsActive]="true"
                            [tdsSize]="'md'" class="mr-2">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="button" [tdsActive]="true"
                            [tdsSize]="'md'">
                        </tds-skeleton-element>
                    </div>

                    <div class="flex flex-auto bg-white p-4"></div>
                </div>
            </div>`,
})

export class CsLoadingPartnerDirective implements OnInit {
    constructor() {
    }

    ngOnInit(): void {

    }
}
