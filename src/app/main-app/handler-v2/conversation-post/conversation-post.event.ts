import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ConversationPostEvent{
  public getOrderTotal$: EventEmitter<number> = new EventEmitter();
}