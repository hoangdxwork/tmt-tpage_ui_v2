import { ChatomniDataItemDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ChatomniLastMessageEventEmitterDto, ChatomniTagsEventEmitterDto } from './../../dto/conversation-all/chatomni/chatomni-conversation';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ChatomniEventEmiterService {

    public tag_ConversationEmiter$ = new EventEmitter<ChatomniTagsEventEmitterDto>();
    public last_Message_ConversationEmiter$ = new EventEmitter<ChatomniLastMessageEventEmitterDto>();
    public quick_Reply_DataSourceEmiter$ = new EventEmitter<ChatomniDataItemDto>();

    public updateMarkSeenBadge$ = new EventEmitter<any>();

    constructor() {
    }
}
