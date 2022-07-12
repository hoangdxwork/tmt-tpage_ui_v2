import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class AddVariantHandler {

    static prepareModel(dataModel: ProductDTO, formModel: any) {
        dataModel.Name = formModel.Name ? formModel.Name : dataModel.Name;
        dataModel.ImageUrl = formModel.ImageUrl ? formModel.ImageUrl : dataModel.ImageUrl;
        dataModel.Image = formModel.Image ? formModel.Image : dataModel.Image;
        dataModel.SaleOK = (formModel.SaleOK || formModel.SaleOK == false) ? formModel.SaleOK : dataModel.SaleOK;
        dataModel.PurchaseOK = (formModel.PurchaseOK || formModel.PurchaseOK == false) ? formModel.PurchaseOK : dataModel.PurchaseOK;
        dataModel.Type = formModel.Type ? formModel.Type : dataModel.Type;
        dataModel.DefaultCode = formModel.DefaultCode ? formModel.DefaultCode : dataModel.DefaultCode;
        dataModel.Barcode = formModel.Barcode ? formModel.Barcode : dataModel.Barcode;
        dataModel.Active = (formModel.Active || formModel.Active == false) ? formModel.Active : dataModel.Active;
        dataModel.PriceVariant = formModel.PriceVariant ? formModel.PriceVariant : dataModel.PriceVariant;
        dataModel.StandardPrice = formModel.StandardPrice ? formModel.StandardPrice : dataModel.StandardPrice;
        dataModel.PurchaseMethod = formModel.PurchaseMethod ? formModel.PurchaseMethod : dataModel.PurchaseMethod;
        dataModel.Weight = formModel.Weight ? formModel.Weight : dataModel.Weight;
        dataModel.SaleDelay = formModel.SaleDelay ? formModel.SaleDelay : dataModel.SaleDelay;
        dataModel.AvailableInPOS = (formModel.AvailableInPOS || formModel.AvailableInPOS == false) ? formModel.AvailableInPOS : dataModel.AvailableInPOS;
        dataModel.InvoicePolicy = formModel.InvoicePolicy ? formModel.InvoicePolicy : dataModel.InvoicePolicy;
        dataModel.AttributeValues = formModel.AttributeValues ? formModel.AttributeValues : dataModel.AttributeValues;
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
    }
}