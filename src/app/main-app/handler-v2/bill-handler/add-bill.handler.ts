import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from './../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AddBillHandler {

  prepareModel(data: FastSaleOrder_DefaultDTOV2, _form: FormGroup) {

    const formModel = _form.value;
    data = Object.assign(data, formModel);

    data.AccountId = data.Account?.Id || data.AccountId;
    _form.controls['AccountId'].setValue(data.AccountId);

    data.CarrierId = data.Carrier?.Id || data.CarrierId;
    _form.controls['CarrierId'].setValue(data.CarrierId);

    data.CompanyId = data.Company?.Id || data.CompanyId;
    _form.controls['CompanyId'].setValue(data.CompanyId);

    data.JournalId = data.Journal?.Id || data.JournalId;
    _form.controls['JournalId'].setValue(data.JournalId);

    data.PaymentJournalId = data.PaymentJournal?.Id || data.PaymentJournalId;
    _form.controls['PaymentJournalId'].setValue(data.PaymentJournalId);

    data.PriceListId = data.PriceList?.Id || data.PriceListId;
    _form.controls['PriceListId'].setValue(data.PriceListId);

    data.TaxId = data.Tax?.Id || data.TaxId;
    _form.controls['TaxId'].setValue(data.TaxId);

    data.UserId = data.User?.Id || data.UserId;
    _form.controls['UserId'].setValue(data.UserId);

    data.TeamId = data.Team?.Id || data.TeamId;
    _form.controls['TeamId'].setValue(data.TeamId);

    data.PartnerId = data.Partner?.Id || data.PartnerId;
    _form.controls['PartnerId'].setValue(data.PartnerId);

    data.WarehouseId = data.Warehouse?.Id || data.WarehouseId;
    _form.controls['WarehouseId'].setValue(data.WarehouseId);

    data.PaymentAmount = Number(data.PaymentAmount)

    data.Ship_ServiceExtrasText = data.Ship_ServiceExtras ? JSON.stringify(data.Ship_ServiceExtras) : data.Ship_ServiceExtrasText;
    data.Ship_ExtrasText = data.Ship_ExtrasText ? JSON.stringify(data.Ship_Extras) : data.Ship_ExtrasText;

    if (data.Ship_Receiver) {
      data.Ship_Receiver.Name = data.ReceiverName;
      data.Ship_Receiver.Phone = data.ReceiverPhone;

      data.Ship_Receiver.City = {
        code: data.Ship_Receiver?.City?.code,
        name: data.Ship_Receiver?.City?.name
      };

      data.Ship_Receiver.District = {
        code: data.Ship_Receiver?.District?.code,
        name: data.Ship_Receiver?.District?.name
      };

      data.Ship_Receiver.Ward = {
        code: data.Ship_Receiver?.Ward?.code,
        name: data.Ship_Receiver?.Ward?.name
      }
    }

    data.ReceiverDate = data.ReceiverDate || null;
    data.DateOrderRed = data.DateOrderRed || null;
    data.DateInvoice = data.DateInvoice || new Date();
    data.DateCreated = new Date();

    // TODO: trường hợp edit
    if(data.Id && data.Id > 0) {
      data.OrderLines.forEach((x: OrderLineV2) => {
        if (x.Id <= 0) {
          x.Id = 0;
        }
        x.Account = x.Account || data.Account;
        x.AccountId = data.AccountId;
        x.OrderId = data.Id;
        x.PartnerId = data.PartnerId;
        x.CompanyId = data.CompanyId;
        x.UserId = data.UserId;
        x.User = x.User || data.User;
      })
    }

    // TODO: trường hợp thêm mới
    else {
      let details: any = [];
      data.OrderLines.forEach((x: OrderLineV2) => {
        let item = {
            Account: data.Account,
            AccountId: data.AccountId,
            Discount: x.Discount,
            Discount_Fixed: x.Discount_Fixed,
            Note: x.Note,
            PriceRecent: x.PriceRecent,
            PriceTotal: x.PriceTotal,
            PriceUnit: x.PriceUnit,
            Product: x.Product,
            ProductId: x.ProductId,
            ProductUOM: x.ProductUOM,
            ProductUOMId: x.ProductUOMId,
            ProductUOMQty: x.ProductUOMQty,
            Type: x.Type || 'percent',
            User: data.User,
            Weight: x.Weight,
            WeightTotal: x.WeightTotal
        }

        details.push(item);
      })

      data.OrderLines = [... details] as any;
    }

    return data;
  }
}
