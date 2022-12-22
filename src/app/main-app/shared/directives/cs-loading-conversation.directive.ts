import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[csLoadingConversation]',
  template: `<div class="h-full flex flex-auto">
          <div class="h-full w-[60.1%] flex flex-col bg-neutral-3-200 px-1 justify-between">
              <div class="h-fit w-full flex flex-row items-center bg-white p-4">
                  <div class="w-full flex gap-6 items-center">
                      <tds-skeleton-element tdsType="avatar" [tdsActive]="true"></tds-skeleton-element>
                      <div class="w-full flex justify-between">
                          <tds-skeleton-element
                              tdsType="input" [tdsActive]="true"
                              [tdsSize]="'lg'" style="width:50%">
                          </tds-skeleton-element>
                          <tds-skeleton-element
                              tdsType="input" [tdsActive]="true"
                              [tdsSize]="'lg'" style="width:20%">
                          </tds-skeleton-element>
                      </div>
                  </div>
              </div>

              <div class="h-full bg-white w-full flex flex-col justify-end my-1">
                <div class="p-4 flex flex-col gap-6">
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'lg'" style="width: 60%">
                    </tds-skeleton-element>
                    <tds-skeleton [tdsActive]="true" style="width: 60%"></tds-skeleton>
                    <div class="flex justify-end">
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width: 70%">
                        </tds-skeleton-element>
                    </div>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'lg'" style="width: 50%">
                    </tds-skeleton-element>
                    <div class="flex flex-col items-end gap-2">
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'lg'" style="width: 60%">
                        </tds-skeleton-element>
                        <tds-skeleton-element
                            tdsType="input" [tdsActive]="true"
                            [tdsSize]="'sm'" style="width: 60%">
                        </tds-skeleton-element>
                    </div>
                </div>
              </div>

              <div class="h-fit w-full flex flex-col">
                <div class="bg-white px-4 py-2 flex gap-2 mb-1">
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width: 10%">
                    </tds-skeleton-element>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width: 10%">
                    </tds-skeleton-element>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width: 10%">
                    </tds-skeleton-element>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width: 10%">
                    </tds-skeleton-element>
                </div>
                <div class="w-full bg-white p-4">
                  <div class="w-full flex gap-6 justify-between mb-6">
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width:60%">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'lg'" style="width:20%">
                      </tds-skeleton-element>
                  </div>
                  <div class="w-full flex gap-2">
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                      <tds-skeleton-element
                          tdsType="input" [tdsActive]="true"
                          [tdsSize]="'sm'" style="width: 30px">
                      </tds-skeleton-element>
                  </div>
                </div>
              </div>
          </div>

          <div class="h-full w-[39.9%] flex flex-col flex-auto">
                <div class="h-fit w-full flex flex-row bg-white gap-x-4 px-4 py-3 mb-1">
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width:50%">
                    </tds-skeleton-element>
                    <tds-skeleton-element
                        tdsType="input" [tdsActive]="true"
                        [tdsSize]="'sm'" style="width:50%">
                    </tds-skeleton-element>
                </div>
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
          </div>
        </div>`,
})

export class CsLoadingConversationDirective implements OnInit {
  constructor() {
  }

  ngOnInit(): void {

  }
}
