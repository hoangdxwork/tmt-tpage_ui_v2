import { ProductVariantDto } from './../../../../dto/configs/product/config-product-variant.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
})
export abstract class CreateVariantsHandler {

   static prepareModel(dataModel: ProductVariantDto, formModel: TDSSafeAny) {
      dataModel = {...dataModel,...formModel};
      return dataModel;
   }
}