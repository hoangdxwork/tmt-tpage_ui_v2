import { ConfigAttributeValue } from './../../dto/configs/product/config-product-default.dto';
import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

@Pipe({
  name: 'showAttributeValue'
})
export class ShowAttributeValuePipe implements PipeTransform {

  constructor(private cdRef: ChangeDetectorRef){}

  transform(AttributeLines: ConfigAttributeValue[]| undefined, AttributeId:number): string {
    let result!:ConfigAttributeValue
    let attrValues = AttributeLines;

    this.cdRef.detectChanges();
    if(attrValues){
      attrValues.forEach((item)=>{
        if(item.AttributeId == AttributeId){
          result = item;
        }
      })
    }
    return result.Name;
  }
}
