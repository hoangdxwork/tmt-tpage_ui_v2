
import { Pipe, PipeTransform } from '@angular/core';
import { DataPouchDBDTO } from '@app/dto/product-pouchDB/product-pouchDB.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Pipe({
  name: 'filterindexdblive'
})

export class FilterIndexDBLivePipe implements PipeTransform {

  transform(data: DataPouchDBDTO[], text: string)  {

    if(!text) return data;
    text = TDSHelperString.stripSpecialChars(text.toLocaleLowerCase().trim());

    let items = data.filter((x: DataPouchDBDTO) =>
      (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text)) !== -1) ||
      (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text)) !== -1) ||
      (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text)) !== -1) ||
      (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text)) !== -1));

    return items;
  }
}
