import { TDSHelperString } from 'tds-ui/shared/utility';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class GenerateTagAttributesFacade {

  mappingTagAttributes(tagWithAttributes?: any, attributeValues?: any[]) {
      let datas: any = [];

      tagWithAttributes = "SP44020,mmmmm";
      attributeValues = [
        {
          Name: "Màu",
          Value: "Trắng",
        },
        {
          Name: "size",
          Value: "26",
        }
      ];

      let tags = [] as any[];
      tags = tagWithAttributes.split(',');

      tags.map((att: any) => {

          let item1 = `${att}`;
          let item2 = `${att}`;

          // let item3 = `${att}`;
          // let item4 = `${att}`;

          let valueAtt = attributeValues?.map((t: any) => TDSHelperString.stripSpecialChars(t.Value).toLocaleLowerCase().trim()) as any[];

          for (let i = 0; i < valueAtt?.length; i++) {
              item1 = `${item1}${valueAtt[i]}`;
              item2 = `${item2} ${valueAtt[i]}`;
          }

          datas.push(item1);
          datas.push(item2);

      })

      return [...datas];
  }
}
