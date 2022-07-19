import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class EditVariantHandler {

    static prepareModel(dataModel:ProductDTO, formModel:TDSSafeAny, images?:TDSSafeAny[]) {    
        
        dataModel = {...dataModel,...formModel};
        dataModel.CategId = formModel.Categ.Id ? formModel.Categ.Id : dataModel.CategId;
        dataModel.UOMId = formModel.UOM.Id ? formModel.UOM.Id : dataModel.UOMId;
        dataModel.UOMName = formModel.UOM.Name ? formModel.UOM.Name : dataModel.UOMName;
        dataModel.UOMPOId = formModel.UOMPO.Id ? formModel.UOMPO.Id : dataModel.UOMPOId;
        dataModel.Images = images ? images : dataModel.Images;
      }
}