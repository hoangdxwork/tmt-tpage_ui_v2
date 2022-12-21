import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ConversationPostEvent{
    public getOrderTotal$: EventEmitter<number> = new EventEmitter();

    // TODO: các sự kiên tạo đơn hàng, thông tin khách hàng từ comment bài viết
    public spinLoadingTab$: EventEmitter<boolean> = new EventEmitter();

    // TODO sự kiện loading
    public isLoadingInsertFromPost$: EventEmitter<boolean> = new EventEmitter();

    // TODO: Tổng commet của bài viết lấy theo length api trả về
    public lengthLstObject$: EventEmitter<number> = new EventEmitter();

}
