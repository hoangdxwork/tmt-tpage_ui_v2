import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { MDB_Facebook_Mapping_PostDto } from '../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fbPostType'
})

export class fbPostTypePipe implements PipeTransform {

  constructor(){}

  transform(data: MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto):MDB_Facebook_Mapping_PostDto {
    return data as MDB_Facebook_Mapping_PostDto;
  }
}