import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[csObjectPartner]',
  template: `<tds-spin class="h-full w-full">
                <div class="h-fit w-full bg-white p-4 mb-1">
                    <tds-skeleton [tdsAvatar]="true" [tdsParagraph]="{ rows: 2 }"></tds-skeleton>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'md'" style="width:100%">
                    </tds-skeleton-element>
                </div>

                <div class="h-fit w-full bg-white p-4 mb-1">
                    <tds-skeleton [tdsAvatar]="true" [tdsParagraph]="{ rows: 2 }"></tds-skeleton>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'md'" style="width:100%">
                    </tds-skeleton-element>
                </div>

                <div class="flex flex-auto bg-white p-4"></div>
            </tds-spin>`,
})

export class CsLoadingObjectDirective implements OnInit {
    constructor() {
    }

    ngOnInit(): void { 
     
    }
}
