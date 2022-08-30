import { Injectable } from "@angular/core";
import { SaleOnlineOrderGetDetailsDto } from "@app/dto/order/so-orderlines.dto";
import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable()

export class PrepareDetailsOrderLineHandler {

    public prepareModel(dataModel: FastSaleOrder_DefaultDTOV2, order: SaleOnlineOrderGetDetailsDto) {

        let model = {...dataModel} as FastSaleOrder_DefaultDTOV2;

        model.Reference = order.Reference;
        if(order.ids && order.ids.length > 0) {
            model.SaleOnlineIds = order.ids;
        }

        model.PartnerId = order.Id;// id khách hàng
        if(order.partner) {
            model.Partner = {...order.partner} as any;
        }

        if(order.partner && (order.partner.DisplayName || order.partner.Name)) {
            model.PartnerDisplayName = (order.partner.DisplayName || order.partner.Name);
            model.ReceiverName = model.PartnerDisplayName;
        }

        if(order.partner && order.partner.Phone) {
            model.Phone = order.partner.Phone;
            model.PartnerPhone = order.partner.Phone;
            model.ReceiverPhone = order.partner.Phone;
        }

        if(order.partner && order.partner.Email) {
          model.PartnerEmail = order.partner.Email;
        }

        if(order.partner && order.partner.Street) {
          model.Address = order.partner.Street;
          model.ReceiverAddress = order.partner.Street;
        }

        model.Comment = order.comment || '';

        if(order.facebookId) {
            model.FacebookId = order.facebookId;
            model.PartnerFacebookId = order.facebookId;
        }

        if(order.facebookName) {
          model.FacebookName = order.facebookName;
        }

        model.Ship_Receiver = {
            Name: model.PartnerDisplayName,
            Phone: model.PartnerPhone,
            Street: model.Address,
            City: order.partner?.City || null,
            District: order.partner?.District || null,
            Ward: order.partner?.Ward || null
        }


        let orderLines: any[] = [];
        order.orderLines?.map(item => {
          let x = {
            AccountId: item.AccountId,
            Discount: item.Discount || 0,
            Discount_Fixed: item.Discount_Fixed || 0,
            Note: item.Note,
            PriceRecent: item.PriceRecent || 0,
            PriceSubTotal: item.PriceSubTotal || 0,
            PriceTotal: item.PriceTotal || 0,
            PriceUnit: item.PriceUnit || 0,
            Product: item.Product || null,
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            ProductNameGet: item.Product?.NameGet,
            ProductUOM: item.ProductUOM || null,
            ProductUOMId: item.ProductUOMId,
            ProductUOMName: item.ProductUOMName,
            ProductUOMQty: item.ProductUOMQty,
            Type: item.Product?.Type,
            Weight: item.Weight || 0,
            WeightTotal: 0
          } as any;

          orderLines.push(x);
        })

        model.OrderLines = [...orderLines];

        return {...model};
    }
}
