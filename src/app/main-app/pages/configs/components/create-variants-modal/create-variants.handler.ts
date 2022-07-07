import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ConfigProductVariant, ConfigAttributeValue } from './../../../../dto/configs/product/config-product-default.dto';
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
})
export abstract class CreateVariantsHandler {

   static prepareModel(dataModel: ConfigProductVariant, formModel: TDSSafeAny) {
      
      dataModel.PriceVariant = formModel.PriceVariant || dataModel.PriceVariant;
      dataModel.Image = formModel.Image || dataModel.Image;
      dataModel.ImageUrl = formModel.ImageUrl || dataModel.ImageUrl;
      dataModel.SaleOK = formModel.SaleOK || formModel.SaleOK == false ? formModel.SaleOK : dataModel.SaleOK;
      dataModel.PurchaseOK = formModel.PurchaseOK || formModel.PurchaseOK == false ? formModel.PurchaseOK : dataModel.PurchaseOK;
      dataModel.Active = formModel.Active || formModel.Active == false ? formModel.Active : dataModel.Active;
      dataModel.Type = formModel.Type || dataModel.Type;
      dataModel.DefaultCode = formModel.DefaultCode || dataModel.DefaultCode;
      dataModel.Barcode = formModel.Barcode || dataModel.Barcode;
   }
}