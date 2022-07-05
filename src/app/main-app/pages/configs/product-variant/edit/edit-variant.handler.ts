import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class EditVariantHandler {

    static prepareModel(dataModel:ProductDTO, formModel:TDSSafeAny, images?:TDSSafeAny[]) {    
        dataModel.Name = formModel.Name ? formModel.Name : dataModel.Name;
        dataModel.Categ = formModel.Categ ? formModel.Categ : dataModel.Categ;
        dataModel.CategId = formModel.Categ.Id ? formModel.Categ.Id : dataModel.CategId;
        dataModel.UOM = formModel.UOM ? formModel.UOM : dataModel.UOM;
        dataModel.UOMId = formModel.UOM.Id ? formModel.UOM.Id : dataModel.UOMId;
        dataModel.UOMName = formModel.UOM.Name ? formModel.UOM.Name : dataModel.UOMName;
        dataModel.PriceVariant = formModel.PriceVariant ? formModel.PriceVariant : dataModel.PriceVariant;
        dataModel.UOMPO = formModel.UOMPO ? formModel.UOMPO : dataModel.UOMPO;
        dataModel.UOMPOId = formModel.UOMPO.Id ? formModel.UOMPO.Id : dataModel.UOMPOId;
        dataModel.ImageUrl = formModel.ImageUrl ? formModel.ImageUrl : dataModel.ImageUrl;
        dataModel.Images = images ? images : dataModel.Images;
      }
}