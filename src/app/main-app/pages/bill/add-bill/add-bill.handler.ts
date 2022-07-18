import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from './../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: 'root'
})
export abstract class AddBillHandler {

   static prepareModel(model: FastSaleOrder_DefaultDTOV2, formModel: FastSaleOrder_DefaultDTOV2) {

      // TODO: set lại company id
    if (!model.CompanyId && model.Company) {
        model.CompanyId = model.Company?.Id;
      }

      model.Id = formModel.Id ? formModel.Id : model.Id;

      if (formModel.Account) {
        model.Account = formModel.Account;
        model.AccountId = formModel.Account.Id;
      }

      model.Partner = formModel.Partner ? formModel.Partner : model.Partner;
      model.PartnerId = formModel.Partner ? formModel.Partner.Id : model.PartnerId;
      model.PriceList = formModel.PriceList ? formModel.PriceList : model.PriceList;
      model.PriceListId = formModel.PriceList ? formModel.PriceList.Id : model.PriceListId;
      model.Warehouse = formModel.Warehouse ? formModel.Warehouse : model.Warehouse;
      model.WarehouseId = formModel.Warehouse ? formModel.Warehouse.Id : model.WarehouseId;
      model.PaymentJournal = formModel.PaymentJournal ? formModel.PaymentJournal : model.PaymentJournal;
      model.PaymentJournalId = formModel.PaymentJournal ? formModel.PaymentJournal.Id : model.PaymentJournalId;
      model.PaymentAmount = Number(formModel.PaymentAmount) ? Number(formModel.PaymentAmount) : model.PaymentAmount;
      model.Team = formModel.Team ? formModel.Team : model.Team;
      model.TeamId = formModel.Team ? formModel.Team.Id : model.TeamId;
      model.Deliver = formModel.Deliver ? formModel.Deliver : model.Deliver;
      model.PreviousBalance = formModel.PreviousBalance ? formModel.PreviousBalance : model.PreviousBalance;
      model.Reference = formModel.Reference ? formModel.Reference : model.Reference;
      model.Revenue = formModel.Revenue ? formModel.Revenue : model.Revenue;
      model.Carrier = formModel.Carrier ? formModel.Carrier : model.Carrier;
      model.CarrierId = formModel.Carrier ? formModel.Carrier.Id : model.CarrierId;
      model.DeliveryPrice = formModel.DeliveryPrice ? formModel.DeliveryPrice : model.DeliveryPrice;
      model.AmountDeposit = formModel.AmountDeposit ? formModel.AmountDeposit : model.AmountDeposit;
      model.CashOnDelivery = formModel.CashOnDelivery ? formModel.CashOnDelivery : model.CashOnDelivery;
      model.ShipWeight = formModel.ShipWeight ? formModel.ShipWeight : model.ShipWeight;
      model.DeliveryNote = formModel.DeliveryNote ? formModel.DeliveryNote : model.DeliveryNote;

      model.Ship_ServiceId = formModel.Ship_ServiceId ? formModel.Ship_ServiceId : model.Ship_ServiceId;
      model.Ship_ServiceName = formModel.Ship_ServiceName ? formModel.Ship_ServiceName : model.Ship_ServiceName;
      model.Ship_ServiceExtras = formModel.Ship_ServiceExtras ? formModel.Ship_ServiceExtras : model.Ship_ServiceExtras;
      model.Ship_Extras = formModel.Ship_Extras ? formModel.Ship_Extras : model.Ship_Extras;

      model.Ship_ServiceExtrasText = formModel.Ship_ServiceExtras ? JSON.stringify(formModel.Ship_ServiceExtras) : model.Ship_ServiceExtrasText;
      model.Ship_ExtrasText = formModel.Ship_ExtrasText ? JSON.stringify(formModel.Ship_Extras) : model.Ship_ExtrasText;

      model.Ship_InsuranceFee = formModel.Ship_InsuranceFee ? formModel.Ship_InsuranceFee : model.Ship_InsuranceFee;
      model.CustomerDeliveryPrice = formModel.CustomerDeliveryPrice ? formModel.CustomerDeliveryPrice : model.CustomerDeliveryPrice;
      model.TrackingRef = formModel.TrackingRef ? formModel.TrackingRef : model.TrackingRef;
      model.Ship_Receiver = formModel.Ship_Receiver ? formModel.Ship_Receiver : model.Ship_Receiver;
      if(model.Ship_Receiver){
        model.Ship_Receiver.Name = model.ReceiverName ? model.ReceiverName : model.Ship_Receiver.Name;
        model.Ship_Receiver.Phone = model.ReceiverPhone ? model.ReceiverPhone : model.Ship_Receiver.Phone;
      }

      model.Address = formModel.Address ? formModel.Address : model.Address;
      model.ReceiverName = formModel.ReceiverName ? formModel.ReceiverName : model.ReceiverName;
      model.ReceiverPhone = formModel.ReceiverPhone ? formModel.ReceiverPhone : model.ReceiverPhone;

      if(formModel.ReceiverDate) {
        model.ReceiverDate = formModel.ReceiverDate.toISOString();
      }

      model.ReceiverAddress = formModel.ReceiverAddress ? formModel.ReceiverAddress : model.ReceiverAddress;
      model.ReceiverNote = formModel.ReceiverNote ? formModel.ReceiverNote : model.ReceiverNote;

      model.User = formModel.User ? formModel.User : model.User;
      model.UserId = formModel.User ? formModel.User.Id : model.UserId;

      if(formModel.DateOrderRed) {
        model.DateOrderRed = formModel.DateOrderRed.toISOString();
      }
      if(formModel.DateInvoice) {
        model.DateInvoice = formModel.DateInvoice.toISOString();
      }

      model.State = formModel.State ? formModel.State : model.State;
      model.NumberOrder = formModel.NumberOrder ? formModel.NumberOrder : model.NumberOrder;
      model.Comment = formModel.Comment ? formModel.Comment : model.Comment;
      model.Seri = formModel.Seri ? formModel.Seri : model.Seri;

      model.WeightTotal = formModel.WeightTotal ? formModel.WeightTotal : model.WeightTotal;
      model.DiscountAmount = formModel.DiscountAmount ? formModel.DiscountAmount : model.DiscountAmount;
      model.Discount = formModel.Discount ? formModel.Discount : model.Discount;
      model.DecreaseAmount = formModel.DecreaseAmount ? formModel.DecreaseAmount : model.DecreaseAmount;
      model.AmountUntaxed = formModel.AmountUntaxed ? formModel.AmountUntaxed : model.AmountUntaxed;
      model.Type = formModel.Type ? formModel.Type : model.Type;
      model.SaleOrder = formModel.SaleOrder ? formModel.SaleOrder : model.SaleOrder;
      model.AmountTotal = formModel.AmountTotal ? formModel.AmountTotal : model.AmountTotal;
      model.TotalQuantity = formModel.TotalQuantity ? formModel.TotalQuantity : model.TotalQuantity;

      model.Tax = formModel.Tax ? formModel.Tax : model.Tax;
      model.TaxId = formModel.Tax ? formModel.Tax.Id : model.TaxId;

      model.OrderLines = formModel.OrderLines ? formModel.OrderLines : model.OrderLines;
      model.OrderLines.forEach((x: OrderLineV2) => {
        if (x.Id <= 0) {
          x.Id = 0;
        }

        if(!x.OrderId && model.Id && model.Id != 0) {
          x.OrderId = model.Id;
        }

        if(!x.PartnerId && model.PartnerId && model.PartnerId != 0) {
          x.PartnerId = model.PartnerId;
        }
        if(!x.CompanyId && model.CompanyId && model.CompanyId != 0) {
          x.CompanyId = model.CompanyId;
        }
        if(!x.UserId && model.UserId ) {
          x.UserId = model.UserId;
        }
        if(!x.User && model.User || model.UserId) {
          x.User = {
            Id: model.User?.Id || model.UserId,
            Name: model.User?.Name || model.UserName
          } as any
        }
      })
   }
}
