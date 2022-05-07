import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { MakeActivityItem } from "../../dto/conversation/make-activity.dto";

@Component({
    selector: "tds-conversation-item",
    templateUrl:'./tds-conversation-item.component.html',
})

export class TDSConversationItemComponent implements OnInit {

  @Input() data!: MakeActivityItem;
  @Input() index!: number;
  @Input() psid!: string;
  @Input() name!: string;
  @Input() partner: any;
  @Input() team: any;
  @Input() children: any;
  @Input() type: any;

  messages: any = [];

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    if(this.data) {}
  }

  public getElement(): ElementRef {
      return this.element;
  }
}
