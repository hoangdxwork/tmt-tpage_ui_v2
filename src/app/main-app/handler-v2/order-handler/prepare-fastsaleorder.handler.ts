import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from "src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable()

export class SO_PrepareFastSaleOrderHandler {

  public so_prepareFastSaleOrder(saleModel: FastSaleOrder_DefaultDTOV2, quickOrderModel: QuickSaleOnlineOrderModel) {

      if(quickOrderModel.LiveCampaignId) {
          saleModel.LiveCampaignId = quickOrderModel.LiveCampaignId;
      }

      if(quickOrderModel.LiveCampaignName) {
          saleModel.LiveCampaignName = quickOrderModel.LiveCampaignName;
      }

      if(quickOrderModel.CRMTeamId) {
        saleModel.TeamId = quickOrderModel.CRMTeamId;
        saleModel.Team = {
            Id: quickOrderModel.CRMTeamId,
            Name: quickOrderModel.CRMTeamName
        } as any;
      }

      saleModel.Phone = quickOrderModel.Telephone || quickOrderModel.PartnerPhone;
      saleModel.Address = quickOrderModel.Address || quickOrderModel.Partner?.Street;
      saleModel.Name = quickOrderModel.Name;

      saleModel.PartnerId = quickOrderModel.PartnerId ||  quickOrderModel.Partner?.Id;
      saleModel.Partner = {
         Id: quickOrderModel.PartnerId || quickOrderModel.Partner?.Id,
         Name: quickOrderModel.PartnerName || quickOrderModel.Partner?.Name
      } as any;

      saleModel.CarrierId = saleModel.Carrier?.Id;
      saleModel.CompanyId = quickOrderModel.CompanyId;
      saleModel.WarehouseId = saleModel.Warehouse?.Id;
      saleModel.FacebookId = quickOrderModel.Facebook_ASUserId;
      saleModel.FacebookName = quickOrderModel.Facebook_UserName;

      saleModel.DateCreated = new Date();

      saleModel.OrderLines = [];
      quickOrderModel.Details.map((x: Detail_QuickSaleOnlineOrder) => {
        let item = {
            DiscountAmount: 0,
            Discount_Fixed: 0,
            Note: x.Note,
            PriceSubTotal: x.Price,
            PriceUnit: x.Price,
            ProductId: x.ProductId,
            ProductUOMId: x.UOMId,
            ProductUOMQty: x.Quantity,
            Type: 'fixed',
        } as any;

        saleModel.OrderLines?.push(item);
      })

      return saleModel;
  }
}
