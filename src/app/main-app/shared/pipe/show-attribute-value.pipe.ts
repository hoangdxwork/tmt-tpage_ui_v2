import { AttributeValueDto } from './../../dto/configs/product/config-product-variant.dto';
import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

@Pipe({
  name: 'showAttributeValue'
})
export class ShowAttributeValuePipe implements PipeTransform {

  constructor(private cdRef: ChangeDetectorRef){}

  transform(AttributeLines: AttributeValueDto[]| undefined, AttributeId:number): string {
    let result!: AttributeValueDto;
    let attrValues = AttributeLines;

    this.cdRef.detectChanges();
    if(attrValues){
      attrValues.forEach((item)=>{
        if(item.AttributeId == AttributeId){
          result = item;
        }
      })
    }
    return result?.Name;
  }
}
