import { Component, ElementRef, Input } from "@angular/core";
import { FacebookGraphMessageDTO } from "../../dto/conversation/message.dto";

@Component({
    selector: "tds-conversation-item",
    templateUrl:'./tds-conversation-item.html',
    host: {
        class: "w-full flex"
    }

})
export class TDSConversationItemComponent {
    @Input() position: "left" | "right" = "left";
    @Input() data!:FacebookGraphMessageDTO ;
    constructor(private element: ElementRef) {

    }
    public getElement(): ElementRef {
        return this.element;
    }
}