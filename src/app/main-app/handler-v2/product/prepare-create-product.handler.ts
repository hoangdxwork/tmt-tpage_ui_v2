import { UserInitDTO } from 'src/app/lib/dto';
import { TAuthService } from 'src/app/lib';
import { ProductTemplateDto, ProductUOMLineDto } from './../../dto/configs/product/config-product-default-v2.dto';
import { AttributeLineDto, ProductVariantDto } from './../../dto/configs/product/config-product-variant.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { ProductComboDto } from './../../dto/product/product-combo.dto';
import { Injectable } from "@angular/core";
import { WallPicturesDTO } from "../../dto/attachment/wall-pictures.dto";

@Injectable({
   providedIn: 'root'
})
export class AddProductHandler {

   static prepareModel(dataModel: ProductTemplateDto, formModel: any, images: WallPicturesDTO[], listAttributeLines?: AttributeLineDto[], listProductVariants?: ProductVariantDto[], listComboProducts?: ProductComboDto[], lstUOM?: any[]) {

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
}
