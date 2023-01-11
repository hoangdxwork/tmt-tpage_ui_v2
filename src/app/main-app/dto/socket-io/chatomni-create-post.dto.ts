import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

export interface SocketioChatomniCreatePostDto {
    Type: string;
    Message: string;
    Data: ChatomniObjectsItemDto;
    EventName: string;
}


