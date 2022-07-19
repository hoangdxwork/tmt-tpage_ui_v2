import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from './../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export abstract class AddBillHandler {

  static prepareModel(model: FastSaleOrder_DefaultDTOV2, formModel: FastSaleOrder_DefaultDTOV2) {
    model = {...model,...formModel};
    model.PartnerId = formModel.Partner ? formModel.Partner.Id : model.PartnerId;
    model.PriceListId = formModel.PriceList ? formModel.PriceList.Id : model.PriceListId;
    model.WarehouseId = formModel.Warehouse ? formModel.Warehouse.Id : model.WarehouseId;
    model.PaymentJournalId = formModel.PaymentJournal ? formModel.PaymentJournal.Id : model.PaymentJournalId;
    model.PaymentAmount = Number(formModel.PaymentAmount) ? Number(formModel.PaymentAmount) : model.PaymentAmount;
    model.TeamId = formModel.Team ? formModel.Team.Id : model.TeamId;
    model.CarrierId = formModel.Carrier ? formModel.Carrier.Id : model.CarrierId;
    model.UserId = formModel.User ? formModel.User.Id : model.UserId;
    model.TaxId = formModel.Tax ? formModel.Tax.Id : model.TaxId;
    model.Ship_ServiceExtrasText = formModel.Ship_ServiceExtras ? JSON.stringify(formModel.Ship_ServiceExtras) : model.Ship_ServiceExtrasText;
    model.Ship_ExtrasText = formModel.Ship_ExtrasText ? JSON.stringify(formModel.Ship_Extras) : model.Ship_ExtrasText;
    if (!model.CompanyId && model.Company) {
      model.CompanyId = model.Company?.Id;
    }
    if (formModel.Account) {
      model.Account = formModel.Account;
      model.AccountId = formModel.Account.Id;
    }
    if (model.Ship_Receiver) {
      model.Ship_Receiver.Name = model.ReceiverName ? model.ReceiverName : model.Ship_Receiver.Name;
      model.Ship_Receiver.Phone = model.ReceiverPhone ? model.ReceiverPhone : model.Ship_Receiver.Phone;
    }
    if (formModel.ReceiverDate) {
      model.ReceiverDate = formModel.ReceiverDate.toISOString();
    }
    if (formModel.DateOrderRed) {
      model.DateOrderRed = formModel.DateOrderRed.toISOString();
    }
    if (formModel.DateInvoice) {
      model.DateInvoice = formModel.DateInvoice.toISOString();
    }
    model.OrderLines.forEach((x: OrderLineV2) => {
      if (x.Id <= 0) {
        x.Id = 0;
      }

      if (!x.OrderId && model.Id && model.Id != 0) {
        x.OrderId = model.Id;
      }

      if (!x.PartnerId && model.PartnerId && model.PartnerId != 0) {
        x.PartnerId = model.PartnerId;
      }
      if (!x.CompanyId && model.CompanyId && model.CompanyId != 0) {
        x.CompanyId = model.CompanyId;
      }
      if (!x.UserId && model.UserId) {
        x.UserId = model.UserId;
      }
      if (!x.User && model.User || model.UserId) {
        x.User = {
          Id: model.User?.Id || model.UserId,
          Name: model.User?.Name || model.UserName
        } as any
      }
    })
  }
}
