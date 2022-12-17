import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[csLoadingPost]',
  template: `<div class="h-full flex flex-auto">
                <tds-spin class="h-full w-[62.5%] flex flex-col bg-neutral-3-200 pr-1">
                    <div class="h-fit w-full flex flex-row items-center gap-x-3 bg-white p-4 mb-1">
                        <tds-skeleton-element
                            tdsType="button" [tdsActive]="true"
                            [tdsSize]="'md'">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="display: flex; flex: 1 1 0%;">
                        </tds-skeleton-element>
                    </div>

                    <div class="h-fit w-full flex flex-row justify-between bg-white p-4">
                        <div class="flex flex-col justify-between h-full w-[60%]">
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:40%">
                            </tds-skeleton-element>
                            <tds-skeleton-element
                                tdsType="input" [tdsActive]="true"
                                [tdsSize]="'sm'" style="width:60%">
                            </tds-skeleton-element>
                        </div>
                        <tds-skeleton-element tdsType="image" [tdsActive]="true"></tds-skeleton-element>
                    </div>

                    <div class="h-fit w-full flex flex-row justify-between px-4 pb-4 bg-white mb-1">
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'md'" style="width:100%">
                        </tds-skeleton-element>
                    </div>

                    <div class="flex flex-auto flex-col w-full bg-white p-4 mb-1">
                        <tds-skeleton [tdsAvatar]="true" [tdsParagraph]="{ rows: 2 }"></tds-skeleton>
                        <tds-skeleton [tdsAvatar]="true" [tdsParagraph]="{ rows: 2 }"></tds-skeleton>
                        <tds-skeleton [tdsAvatar]="true" [tdsParagraph]="{ rows: 2 }"></tds-skeleton>
                    </div>
                </tds-spin>
                <div class="h-full w-[37.5%] flex flex-col flex-auto bg-neutral-3-200">
                    <div class="h-fit w-full flex flex-row bg-white gap-x-4 p-4 mb-1">
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'md'" style="width:30%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'md'" style="width:30%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'md'" style="width:30%">
                        </tds-skeleton-element>
                    </div>

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
export class CsLoadingPostDirective implements OnInit {
    constructor() {
    }

    ngOnInit(): void { }
}
