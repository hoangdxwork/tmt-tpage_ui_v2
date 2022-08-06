import { ChatomniLastMessageEventEmitterDto, ChatomniTagsEventEmitterDto } from './../../dto/conversation-all/chatomni/chatomni-conversation';
import { EventEmitter, Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})

export class ChatomniEventEmiterService {
    tag_ConversationEmiter$ = new EventEmitter<ChatomniTagsEventEmitterDto>();
    last_Message_ConversationEmiter$ = new EventEmitter<ChatomniLastMessageEventEmitterDto>();

    constructor() {
    }
}