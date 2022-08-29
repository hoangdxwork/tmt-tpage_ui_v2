import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable()

export class PrepareOrderBill {
    
    public prepareModel(data: any): FastSaleOrder_DefaultDTOV2 {
        let model = {} as FastSaleOrder_DefaultDTOV2;
    
        model.SaleOnlineIds = data.ids;
        model.Reference = data.Reference;
        model.Partner = data.partner;
        model.Comment = data.comment || '';
        model.FacebookId = data.facebookId;
        model.FacebookName = data.facebookName;
        model.IsProductDefault = data.isProductDefault;
        model.PartnerId = data.Id;
        //Check kho hàng
        if (data.warehouse) {
          model.Warehouse = data.warehouse;
        }
        model.ReceiverName = data.partner.DisplayName;
        let orderLines: any[] = [];
    
        for (var item of data.orderLines) {
          orderLines.push({
            AccountId: item.AccountId,
            Discount: item.Discount || 0,
            Discount_Fixed: item.Discount_Fixed || 0,
            Note: item.Note,
            PriceRecent: item.PriceRecent || 0,
            PriceSubTotal: item.PriceSubTotal || 0,
            PriceTotal: item.PriceTotal || 0,
            PriceUnit: item.PriceUnit || 0,
            Product: item.Product,
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            ProductNameGet: item.Product.NameGet,
            ProductUOM: item.ProductUOM,
            ProductUOMId: item.ProductUOMId,
            ProductUOMName: item.ProductUOMName,
            ProductUOMQty: item.ProductUOMQty,
            Type: item.Product.Type,
            Weight: item.Weight || 0,
            WeightTotal: 0
          });
        }
    
        model.OrderLines = [...orderLines];
    
        return {...model};
    }
}