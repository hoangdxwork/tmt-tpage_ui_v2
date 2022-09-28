import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToCRMTagsList'
})

export class ConvertToCRMTagsListPipe implements PipeTransform {

  constructor(){}

  transform(data: any, lstPartnerStatus: any[]) {
      let value: any = [];
      if(data && lstPartnerStatus) {
        data.map((x: any) => {
            let ex = lstPartnerStatus.filter(s => s.text === (x.text || x))[0];
            if(ex) {
                value.push(ex);
            } else {
                value.push({ text: (x.text || x), value: null });
            }
         })
      }
      return value;
  }

}
