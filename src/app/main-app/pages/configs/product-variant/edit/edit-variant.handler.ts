import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export  class EditVariantHandler {

    public prepareModel(dataModel:ProductDTO, formModel:TDSSafeAny, images?:TDSSafeAny[]) {

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

        return dataModel;
      }
}
