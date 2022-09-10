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
      saleModel.DeliveryNote = quickOrderModel.Note;

      // khi ko phải là khách hàng
      saleModel.PartnerId = quickOrderModel.PartnerId ||  quickOrderModel.Partner?.Id;
      if(Number(saleModel.PartnerId)) {
          saleModel.Partner = {
            Id: saleModel.PartnerId,
            Name: quickOrderModel.PartnerName || quickOrderModel.Partner?.Name
        } as any;
      } else {
          delete saleModel.PartnerId;
          delete saleModel.Partner;
      }

      saleModel.CarrierId = saleModel.Carrier?.Id;
      if(saleModel.CarrierId == 0 ||  saleModel.CarrierId == null) {
        delete saleModel.CarrierId;
      }

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
