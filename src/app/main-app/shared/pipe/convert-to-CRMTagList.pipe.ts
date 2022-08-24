import { CRMTagDTO } from './../../dto/crm-tag/odata-crmtag.dto';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToCRMTagsList'
})

export class ConvertToCRMTagsListPipe implements PipeTransform {

  constructor(){}

  transform(data: string[]): CRMTagDTO[] {
    return data?.map((x)=>{
        return {
            Name: x
        } as CRMTagDTO
    }) || [];
  }

}