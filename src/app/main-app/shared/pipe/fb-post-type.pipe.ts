import { ChatomniFacebookDataDto, ChatomniTShopDataDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { MDB_Facebook_Mapping_PostDto } from '../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Pipe, PipeTransform } from '@angular/core';
import { ChatomniObjectDataTiktokDto } from '@app/dto/conversation-all/chatomni/chatomni-object-tiktok.dto';
import { TikTokLiveItemDataDto } from '@app/dto/conversation-all/chatomni/tikitok-live.dto';

// Dữ liệu objects

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
  name: 'tiktokType'
})
export class ChatomniTiktokType implements PipeTransform {
  transform(data: any): ChatomniObjectDataTiktokDto {
      return data as ChatomniObjectDataTiktokDto;
  }
}


// Dữ liệu comment

@Pipe({
  name: 'facebookDataCs'
})
export class ChatomniFacebookData implements PipeTransform {
  transform(data: ChatomniFacebookDataDto | ChatomniTShopDataDto): ChatomniFacebookDataDto {
      return data as ChatomniFacebookDataDto;
  }
}

@Pipe({
  name: 'tshopDataCs'
})
export class ChatomniTShopData implements PipeTransform {
  transform(data: ChatomniFacebookDataDto | ChatomniTShopDataDto): ChatomniTShopDataDto {
      return data as ChatomniTShopDataDto;
  }
}

@Pipe({
  name: 'tiktokDataCs'
})
export class ChatomniTiktokData implements PipeTransform {
  transform(data: any): TikTokLiveItemDataDto {
      return data as TikTokLiveItemDataDto;
  }
}
