import { OrderLineV2, FastSaleOrder_DefaultDTOV2 } from './../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareCopyItemHandler {

    public prepareModel(item: any, dataModel: FastSaleOrder_DefaultDTOV2): OrderLineV2 {
        return {
            Id: 0,
            ProductId: item.ProductId,
            ProductUOMId: item.ProductUOMId,
            PriceUnit: item.PriceUnit,
            ProductUOMQty: item.ProductUOMQty,
            UserId: item.UserId || dataModel.UserId,
            Discount: item.Discount,
            Discount_Fixed: item.Discount_Fixed,
            PriceTotal: item.PriceTotal,
            PriceSubTotal: item.PriceSubTotal,
            Weight: item.Weight,
            WeightTotal: item.WeightTotal,
            AccountId: item.AccountId || dataModel.Account?.Id,
            PriceRecent: item.PriceRecent,
            Name: item.Name,
            IsName: false,
            OrderId: dataModel.Id,
            LiveCampaign_DetailId: null,
            LiveCampaignQtyChange: 0,
            ProductName: item.ProductName,
            ProductUOMName: item.ProductUOMName,
            SaleLineIds: item.SaleLineIds,
            ProductNameGet: item.ProductNameGet,
            SaleLineId: item.SaleLineId,
            Type: item.Type,
            PromotionProgramId: item.PromotionProgramId,
            Note: item.Note,
            ProductBarcode: item.ProductBarcode,
            CompanyId: item.CompanyId || dataModel.Company?.Id,
            PartnerId: dataModel.PartnerId,
            PriceSubTotalSigned: item.PriceSubTotalSigned,
            PromotionProgramComboId: item.PromotionProgramComboId,
            Product: null,
            ProductUOM: item.ProductUOM,
            Account: item.Account,
            SaleLine: null,
            User: dataModel.User || null
        }
    }
}