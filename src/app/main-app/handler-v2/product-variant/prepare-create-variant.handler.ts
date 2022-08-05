import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PrepareCreateVariantHandler {

    public prepareModel(dataModel: ProductDTO, formModel: any) {

        dataModel = Object.assign(dataModel, formModel);

        if (formModel.Categ) {
            dataModel.Categ = formModel.Categ;
            dataModel.CategId = formModel.Categ.Id;
            dataModel.CategName = formModel.Categ.Name;
        } else {
            dataModel.CategId = dataModel.Categ.Id;
            dataModel.CategName = formModel.Categ.Name;
        }

        if (formModel.UOM) {
            dataModel.UOM = formModel.UOM;
            dataModel.UOMId = formModel.UOM.Id;
        } else {
            dataModel.UOMId = dataModel.UOM.Id;
            dataModel.UOMName = formModel.UOM.Name;
        }

        if (formModel.UOMPO) {
            dataModel.UOMPO = formModel.UOMPO;
            dataModel.UOMPOId = formModel.UOMPO.Id;
        } else {
            dataModel.UOMPOId = dataModel.UOMPO.Id;
        }

        if (formModel.POSCateg) {
            dataModel.POSCateg = formModel.POSCateg;
            dataModel.POSCategId = formModel.POSCateg.Id;
        }

        return dataModel;
    }
}
