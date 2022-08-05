import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { MDB_Facebook_Mapping_PostDto } from '../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tShopPostType'
})

export class tShopPostTypePipe implements PipeTransform {

  constructor(){}

  transform(data: MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto): ChatomniDataTShopPostDto {
    return data as ChatomniDataTShopPostDto;
  }
}

