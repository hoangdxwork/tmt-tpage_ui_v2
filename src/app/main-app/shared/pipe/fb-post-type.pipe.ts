import { ChatomniFacebookDataDto, ChatomniTShopDataDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
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

@Pipe({
  name: 'facebookDataMessage'
})

export class ChatomniFacebookData implements PipeTransform {

  transform(data: ChatomniFacebookDataDto | ChatomniTShopDataDto): ChatomniFacebookDataDto {
      return data as ChatomniFacebookDataDto;
  }
}

@Pipe({
  name: 'tShopDataMessage'
})

export class ChatomniTShopData implements PipeTransform {

  transform(data: ChatomniFacebookDataDto | ChatomniTShopDataDto): ChatomniTShopDataDto {
      return data as ChatomniTShopDataDto;
  }
}