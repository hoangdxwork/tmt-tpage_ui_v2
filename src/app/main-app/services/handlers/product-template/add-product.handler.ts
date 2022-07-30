import { WallPicturesDTO } from '../../../dto/attachment/wall-pictures.dto';
import { ConfigProductDefaultDTO, ConfigAttributeLine, ConfigProductVariant } from '../../../dto/configs/product/config-product-default.dto';
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
})
export class AddProductHandler {
   
   static prepareModel(dataModel: ConfigProductDefaultDTO, formModel: any, images: WallPicturesDTO[], listAttributeLines: ConfigAttributeLine[], listProductVariants: ConfigProductVariant[]) {

      dataModel = {...dataModel,...formModel};
      dataModel.AttributeLines = listAttributeLines ?? dataModel.AttributeLines;
      dataModel.ProductVariants = listProductVariants ?? dataModel.ProductVariants;
      dataModel.ProductVariantCount = listProductVariants?.length ?? dataModel.ProductVariants?.length;
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

      return dataModel;
   }
}