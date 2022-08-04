import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class OrderEvent{
  public getBillOrder$: EventEmitter<any> = new EventEmitter();
}