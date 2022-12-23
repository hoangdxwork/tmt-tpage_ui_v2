import { EventEmitter, Injectable } from "@angular/core";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";

@Injectable()

export class ConversationPostEvent{
    public getOrderTotal$: EventEmitter<number> = new EventEmitter();

    // TODO: các sự kiên tạo đơn hàng, thông tin khách hàng từ comment bài viết
    public spinLoadingTab$: EventEmitter<boolean> = new EventEmitter();

    // TODO sự kiện loading
    public isLoadingInsertFromPost$: EventEmitter<boolean> = new EventEmitter();

    // TODO: Đếm số comment được realtime trả về
    public countRealtimeMessage$: EventEmitter<boolean> = new EventEmitter();
    public pushCountRealtimeToView$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter();
}
