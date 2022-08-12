import { MDB_Facebook_Mapping_PostDto } from './../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ObjectFacebookPostEvent{
  public getObjectFBData$: EventEmitter<MDB_Facebook_Mapping_PostDto> = new EventEmitter();
}