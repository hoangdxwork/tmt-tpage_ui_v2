import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ObjectFacebookPostEvent{
  public getObjectFBData$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter();
}