import { ChatomniDataItemDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ChatomniLastMessageEventEmitterDto, ChatomniTagsEventEmitterDto } from './../../dto/conversation-all/chatomni/chatomni-conversation';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ChatomniEventEmiterService {

    //TODO: tryền gán tag và gỡ tag từ tds-coversation sang conversation-all
    public tag_ConversationEmiter$ = new EventEmitter<ChatomniTagsEventEmitterDto>();
    
    //TODO: tryền tin nhắn cuối sang conversation-all
    public last_Message_ConversationEmiter$ = new EventEmitter<ChatomniLastMessageEventEmitterDto>();

    //TODO: tryền tin nhắn, bình luận mới sang tds-coversation
    public quick_Reply_DataSourceEmiter$ = new EventEmitter<ChatomniDataItemDto>();

    public updateMarkSeenBadge$ = new EventEmitter<any>();

    //TODO: tryền số lượng tin nhắn chưa đọc thành 0 khi đã xem sang conversation-all
    public countUnreadEmiter$ = new EventEmitter<string>();

    //TODO: tryền bật chatbot thành công về conversation-all
    public chatbotStateEmiter$ = new EventEmitter<string>();

    //TODO: Thêm đơn hàng thành công gọi lại conversation-partner
    public callConversationPartnerEmiter$ = new EventEmitter<boolean>();

    constructor() {
    }
}
