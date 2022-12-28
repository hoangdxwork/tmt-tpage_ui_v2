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

          let valueAtt = attributeValues?.map((t: any) => TDSHelperString.stripSpecialChars(t.Value).toLocaleLowerCase().trim());

      })

      return [...datas];
  }
}
