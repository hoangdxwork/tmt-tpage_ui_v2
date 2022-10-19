import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ConfigProductVariant, ConfigAttributeValue } from './../../../../dto/configs/product/config-product-default.dto';
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
})
export abstract class CreateVariantsHandler {

   static prepareModel(dataModel: ConfigProductVariant, formModel: TDSSafeAny) {
      dataModel = {...dataModel,...formModel};
      return dataModel;
   }
}