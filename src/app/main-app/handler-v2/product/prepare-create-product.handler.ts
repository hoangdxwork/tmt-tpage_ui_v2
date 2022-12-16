import { ProductTemplateDTO } from './../../dto/product/product.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { UOMLine, ConfigUOM, ConfigUOMPO, ConfigSuggestVariants } from './../../dto/configs/product/config-product-default.dto';
import { ComboProductDTO } from './../../dto/product/product-combo.dto';
import { Injectable } from "@angular/core";
import { WallPicturesDTO } from "../../dto/attachment/wall-pictures.dto";
import { ConfigAttributeLine, ConfigProductDefaultDTO, ConfigProductVariant } from "../../dto/configs/product/config-product-default.dto";

@Injectable({
   providedIn: 'root'
})
export class AddProductHandler {

   static prepareModel(dataModel: ConfigProductDefaultDTO, formModel: any, images: WallPicturesDTO[], listAttributeLines?: ConfigAttributeLine[], listProductVariants?: ConfigProductVariant[], listComboProducts?: ComboProductDTO[], lstUOM?: any[]) {

      dataModel = {...dataModel,...formModel};

      if(listAttributeLines){
         dataModel.AttributeLines = listAttributeLines;
      }

      if(listProductVariants){
         listProductVariants.map(x => {
            if(x.Tags && TDSHelperArray.isArray(x.Tags)){
               x.Tags = x.Tags.toString();
            }
         });
         dataModel.ProductVariants = listProductVariants;
         dataModel.ProductVariantCount = listProductVariants?.length;
      }

      if(listComboProducts){
         dataModel.ComboProducts = listComboProducts;
      }

      if(lstUOM){
         lstUOM.map(x => {
            if(x.Id <= 0){
               delete x.Id;
            }
         })
         dataModel.UOMLines = lstUOM;
      }
      // TODO: chuyển đổi từ g sang kg
      dataModel.Weight = Number(dataModel.Weight/1000);

      dataModel.Images = images || [];
      dataModel.ProductVariants.map(
         (variant)=>{
            if(variant.Id < 0) variant.Id = 0;
         }
      )

      if (formModel.Categ) {
         dataModel.Categ = formModel.Categ;
         dataModel.CategId = formModel.Categ.Id;
         dataModel.CategName = formModel.Categ.Name;
         dataModel.CategNameNoSign = formModel.Categ.NameNoSign;
         dataModel.CategCompleteName = formModel.Categ.CompleteName;
      } else {
         dataModel.CategId = dataModel.Categ.Id;
         dataModel.CategName = dataModel.Categ.Name;
         dataModel.CategNameNoSign = dataModel.Categ.NameNoSign;
         dataModel.CategCompleteName = dataModel.Categ.CompleteName;
      }
      if (formModel.UOM) {
         dataModel.UOM = formModel.UOM;
         dataModel.UOMId = formModel.UOM.Id;
         dataModel.UOMName = formModel.UOM.Name;
         dataModel.UOMNameNoSign = formModel.UOM.NameNoSign;
      } else {
         dataModel.UOMId = dataModel.UOM.Id;
         dataModel.UOMName = dataModel.UOM.Name;
         dataModel.UOMId = dataModel.UOM.NameNoSign;
      }
      if (formModel.UOMPO) {
         dataModel.UOMPO = formModel.UOMPO;
         dataModel.UOMPOId = formModel.UOMPO.Id;
         dataModel.UOMPOName = formModel.UOMPO.Name;
         dataModel.UOMPONameNoSign = formModel.UOMPO.NameNoSign;
      } else {
         dataModel.UOMPOId = dataModel.UOMPO.Id;
         dataModel.UOMPOName = dataModel.UOMPO.Name;
         dataModel.UOMPONameNoSign = dataModel.UOMPO.NameNoSign;
      }
      if (formModel.POSCateg) {
         dataModel.POSCategId = formModel.POSCateg.Id;
      }
      if (formModel.Producer) {
         dataModel.Producer = formModel.Producer;
         dataModel.ProducerId = formModel.Producer.Id;
         dataModel.ProducerName = formModel.Producer.Name;
         dataModel.ProducerAddress = formModel.Producer.Address;
      } else {
         if (dataModel.Producer) {
            dataModel.ProducerId = dataModel.Producer.Id;
            dataModel.ProducerName = dataModel.Producer.Name;
            dataModel.ProducerAddress = dataModel.Producer.Address;
         }
      }
      if (formModel.Importer) {
         dataModel.Importer = formModel.Importer;
         dataModel.ImporterId = formModel.Importer.Id;
         dataModel.ImporterName = formModel.Importer.Name;
         dataModel.ImporterAddress = formModel.Importer.Address;
      } else {
         if (dataModel.Importer) {
            dataModel.ImporterId = dataModel.Importer.Id;
            dataModel.ImporterName = dataModel.Importer.Name;
            dataModel.ImporterAddress = dataModel.Importer.Address;
         }
      }
      if (formModel.Distributor) {
         dataModel.Distributor = formModel.Distributor;
         dataModel.DistributorId = formModel.Distributor.Id;
         dataModel.DistributorName = formModel.Distributor.Name;
         dataModel.DistributorAddress = formModel.Distributor.Address;
      } else {
         if (dataModel.Distributor) {
            dataModel.DistributorId = dataModel.Distributor.Id;
            dataModel.DistributorName = dataModel.Distributor.Name;
            dataModel.DistributorAddress = dataModel.Distributor.Address;
         }
      }
      if (formModel.OriginCountry) {
         dataModel.OriginCountry = formModel.OriginCountry;
         dataModel.OriginCountryId = formModel.OriginCountry.Id;
         dataModel.OriginCountryName = formModel.OriginCountry.Name;
      } else {
         if (dataModel.OriginCountry) {
            dataModel.OriginCountryId = dataModel.OriginCountry.Id;
            dataModel.OriginCountryName = dataModel.OriginCountry.Name;
         }
      }

      dataModel["OrderTag"] = formModel.OrderTag ? formModel.OrderTag.toString(): null;
      return dataModel;
   }

   static prepareSuggestModel(data: ConfigProductDefaultDTO) {
      let model = {} as ConfigSuggestVariants;
  
      model.Active = data.Active;
      model.AttributeLines = data.AttributeLines as ConfigAttributeLine[];
      model.AvailableInPOS = data.AvailableInPOS as boolean;
      model.BOMCount = data.BOMCount;
      model.Categ = data.Categ;
      model.CategId = data.CategId;
      model.ComboProducts = data.ComboProducts;
      model.CompanyId = data.CompanyId as number;
      model.DiscountPurchase = data.DiscountPurchase as number;
      model.DiscountSale = data.DiscountSale as number;
      model.EnableAll = data.EnableAll;
      model.Id = data.Id;
      model.IncomingQty = data.IncomingQty;
      model.InitInventory = data.InitInventory as number;
      model.InvoicePolicy = data.InvoicePolicy;
      model.IsCombo = data.IsCombo as boolean;
      model.IsProductVariant = data.IsProductVariant;
      model.Items = data.Items;
      model.ListPrice = data.ListPrice as number;
      model.Name = data.Name;
      model.OutgoingQty = data.OutgoingQty;
      model.ProductSupplierInfos = data.ProductSupplierInfos;
      model.ProductVariantCount = data.ProductVariantCount;
      model.PurchaseMethod = data.PurchaseMethod;
      model.PurchaseOK = data.PurchaseOK;
      model.PurchasePrice = data.PurchasePrice as number;
      model.QtyAvailable = data.QtyAvailable;
      model.SaleDelay = data.SaleDelay as number;
      model.SaleOK = data.SaleOK;
      model.ShowType = data.ShowType;
      model.StandardPrice = data.StandardPrice as number;
      model.Tracking = data.Tracking;
      model.Type = data.Type;
      model.UOM = data.UOM as ConfigUOM;
      model.UOMId = data.UOMId;
      model.UOMLines = data.UOMLines;
      model.UOMPO = data.UOMPO as ConfigUOMPO;
      model.UOMPOId = data.UOMPOId;
      model.Version = data.Version;
      model.VirtualAvailable = data.VirtualAvailable;
      model.Weight = data.Weight as number;
  
      return {...model};
    }
}
