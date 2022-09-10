import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ConversationPostEvent{
    public getOrderTotal$: EventEmitter<number> = new EventEmitter();

    // TODO: các sự kiên tạo đơn hàng, thông tin khách hàng từ comment bài viết
    public spinLoadingTab$: EventEmitter<boolean> = new EventEmitter();
}
