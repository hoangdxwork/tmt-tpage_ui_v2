import { ConfigAttributeValue } from './../../dto/configs/product/config-product-default.dto';
import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

interface LinesPipeModel{ 
  AttributeLines: ConfigAttributeValue[]| undefined, 
  AttributeId:number
}

@Pipe({
  name: 'showAttributeValue'
})
export class ShowAttributeValuePipe implements PipeTransform {

  constructor(private cdRef: ChangeDetectorRef){}

  transform(data:LinesPipeModel): string {
    let result!:ConfigAttributeValue
    let attrValues = data.AttributeLines;

    this.cdRef.detectChanges();
    if(attrValues){
      attrValues.forEach((item)=>{
        if(item.AttributeId == data.AttributeId){
          result = item;
        }
      })
    }
    return result.Name;
  }
}
