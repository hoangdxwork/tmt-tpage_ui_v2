import { ChatomniTagsEventEmitterDto } from './../../dto/conversation-all/chatomni/chatomni-conversation';
import { EventEmitter, Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})

export class ChatomniEventEmiterService {
    tagConversationEniter$ = new EventEmitter<ChatomniTagsEventEmitterDto>();

    constructor() {
    }
}