import { ProductVariantDto } from './../../dto/configs/product/config-product-variant.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export  class PrepareEditVariantHandler {

    public prepareModel(dataModel: ProductVariantDto, formModel: any, images?: any[]) {

        dataModel.Name = formModel.Name;
        dataModel.PriceVariant = formModel.PriceVariant;

        if(formModel.Categ) {
          dataModel.CategId = formModel.Categ?.Id;
          dataModel.Categ = formModel.Categ;
        }

        if(formModel.UOM) {
          dataModel.UOMId = formModel.UOM?.Id;
          dataModel.UOM = formModel.UOM;
        }

        if(formModel.UOMPO) {
          dataModel.UOMPOId = formModel.UOMPO?.Id;
          dataModel.UOMPO = formModel.UOMPO;
        }

        if(images) {
          dataModel.Images = images;
        }

        if(formModel.OrderTag) {
          dataModel.OrderTag = formModel.OrderTag.toString();
        }

        return dataModel;
      }
}
