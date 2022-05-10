import { TDSSafeAny } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { FastSaleOrderDefaultDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';

export interface Ship_Receiver {
  Name: string;
  Phone: string;
  Street: string;
  // Object {name: "", code: ""}
  City: any;
  District: any;
  Ward: any;
}

@Injectable({
  providedIn: 'root'
})
export class FastSaleOrderHandler {

  constructor(
  ) {

  }

  prepareBill(saleModel: any, orderForm: any, shipExtraServices: Array<any>): any {
    var _model = orderForm.value;

    saleModel.PartnerId = _model.PartnerId;
    saleModel.Partner = _model.Partner && _model.Partner.Id ? _model.Partner.Id : null;
    saleModel.FacebookId = _model.Facebook_UserId;
    saleModel.FacebookName = _model.Facebook_UserName || _model.Name || _model.PartnerName;
    saleModel.Facebook_ASUserId = _model.Facebook_ASUserId;

    saleModel.Tax = _model.Tax;
    saleModel.Discount = _model.Discount;
    saleModel.AmountTax = _model.AmountTax;
    saleModel.AmountUntaxed = _model.AmountUntaxed;
    saleModel.DecreaseAmount = _model.DecreaseAmount;
    saleModel.DiscountAmount = _model.DiscountAmount;
    saleModel.PaymentAmount = _model.PaymentAmount || 0;

    saleModel.TaxId = _model.Tax ? _model.Tax.Id : null;
    saleModel.User = _model.User;
    saleModel.UserId = _model.User ? _model.User.Id : null

    saleModel.CompanyId = saleModel.Company ? saleModel.Company.Id : 0;
    saleModel.AccountId = saleModel.Account ? saleModel.Account.Id : 0;
    saleModel.JournalId = saleModel.Journal ? saleModel.Journal.Id : 0;
    saleModel.PriceListId = saleModel.PriceList ? saleModel.PriceList.Id : 0;
    saleModel.WarehouseId = saleModel.Warehouse ? saleModel.Warehouse.Id : 0;

    saleModel.Carrier = saleModel.Carrier != null && saleModel.Carrier.Id ? saleModel.Carrier : null;
    saleModel.CarrierId = saleModel.Carrier != null && saleModel.Carrier.Id ? saleModel.Carrier.Id : null;

    saleModel.PaymentJournalId = saleModel.PaymentJournal != null ? saleModel.PaymentJournal.Id : null;

    // Xóa detail gán lại
    saleModel.OrderLines = [];

    _model.Details.forEach((element: TDSSafeAny) => {
      if (!saleModel.OrderLines)
        saleModel.OrderLines = [];

      saleModel.OrderLines.push({
        ProductId: element.ProductId,
        ProductUOMId: element.UOMId,
        ProductUOMQty: element.Quantity,
        PriceUnit: element.Price,
        Discount: 0,
        Discount_Fixed: 0,
        Type: "fixed",
        PriceSubTotal: element.Price * element.Quantity,
        Note: element.Note
      });
    });

    saleModel.Ship_Receiver = this.prepareShipReceiverModel(_model);
    shipExtraServices = shipExtraServices && shipExtraServices.length > 0 ? shipExtraServices : [];

    let result = {
      saleModel: saleModel,
      // calculateFee: model,
      shipExtraServices: shipExtraServices,
    };

    return result;
  }

  private prepareShipReceiverModel(orderValue: any): Ship_Receiver {
    var model: Ship_Receiver = {
      Name: orderValue.PartnerName || orderValue.Name,
      Phone: orderValue.Telephone,
      Street: orderValue.Street || orderValue.Address,
      City: orderValue.City,
      District: orderValue.District,
      Ward: orderValue.Ward
    };

    return model;
  }

  checkValue(model: FastSaleOrderDefaultDTO): string | undefined {
    debugger;
    let result = undefined;
    if(!model.Ship_Receiver) {
      result = "Chưa có địa chỉ giao hàng";
    }
    else if(!model.Ship_Receiver?.City?.Code) {
      result = "Chưa có tỉnh/thành phố";
    }
    else if(!model.Ship_Receiver?.District?.Code) {
      result = "Chưa có quận/huyện";
    }
    else if(!model.Ship_Receiver?.Ward?.Code) {
      result = "Chưa có phường/xã";
    }

    return result;
  }

}
