import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { MDB_Facebook_Mapping_PostDto } from '../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facebookType'
})

export class ChatomniFacebookType implements PipeTransform {

  transform(data: MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto): MDB_Facebook_Mapping_PostDto {
      return data as MDB_Facebook_Mapping_PostDto;
  }
}

@Pipe({
  name: 'tshopType'
})

export class ChatomniTShopType implements PipeTransform {

  transform(data: MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto): ChatomniDataTShopPostDto {
      return data as ChatomniDataTShopPostDto;
  }
}
