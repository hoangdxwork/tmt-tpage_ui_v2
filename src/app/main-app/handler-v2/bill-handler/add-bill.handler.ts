import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from './../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";
import { FormGroup } from '@angular/forms';

@Injectable()

export class AddBillHandler {

  prepareModel(data: FastSaleOrder_DefaultDTOV2, _form: FormGroup, idEdit: any) {
    const formModel = _form.value;
    data = Object.assign(data, formModel);

    if(data.Id == 0 || data.Id == null) {
        delete data.Id;
    }

    data.AccountId = Number(data.Account?.Id || data.AccountId);
    if(data.AccountId && data.AccountId != 0) {
      _form.controls['AccountId'].setValue(data.AccountId);
    }

    data.CarrierId = Number(data.Carrier?.Id || data.CarrierId);
    if(data.CarrierId && data.CarrierId != 0) {
      _form.controls['CarrierId'].setValue(data.CarrierId);
    }

    if(data.CarrierId == 0 || data.CarrierId == null) {
      delete data.CarrierId;
    }

    data.CompanyId = Number(data.Company?.Id || data.CompanyId);
    if(data.CompanyId && data.CompanyId != 0) {
      _form.controls['CompanyId'].setValue(data.CompanyId);
    }

    data.JournalId = Number(data.Journal?.Id || data.JournalId);
    if(data.JournalId && data.JournalId != 0) {
      _form.controls['JournalId'].setValue(data.JournalId);
    }

    data.PaymentJournalId = Number(data.PaymentJournal?.Id || data.PaymentJournalId);
    if(data.PaymentJournalId && data.PaymentJournalId != 0) {
      _form.controls['PaymentJournalId'].setValue(data.PaymentJournalId);
    }

    data.PriceListId = Number(data.PriceList?.Id || data.PriceListId);
    if(data.PriceListId && data.PriceListId != 0) {
      _form.controls['PriceListId'].setValue(data.PriceListId);
    }

    data.TaxId = data.Tax?.Id || data.TaxId;
    if(data.TaxId && data.TaxId != 0) {
      _form.controls['TaxId'].setValue(data.TaxId);
    }

    data.UserId = data.User?.Id || data.UserId;
    if(data.UserId) {
      _form.controls['UserId'].setValue(data.UserId);
    }

    data.TeamId = data.Team?.Id || data.TeamId; // teamId gán null, = 0 lỗi
    if(data.TeamId && data.TeamId != 0) {
      _form.controls['TeamId'].setValue(data.TeamId);
    }

    data.PartnerId = Number(data.Partner?.Id || data.PartnerId);
    if(data.PartnerId && data.PartnerId != 0) {
      _form.controls['PartnerId'].setValue(data.PartnerId);
    }

    data.WarehouseId = Number(data.Warehouse?.Id || data.WarehouseId);
    if(data.WarehouseId && data.WarehouseId != 0) {
      _form.controls['WarehouseId'].setValue(data.WarehouseId);
    }

    data.PaymentAmount = Number(data.PaymentAmount);

    data.Ship_ServiceExtrasText = data.Ship_ServiceExtras ? JSON.stringify(data.Ship_ServiceExtras) : data.Ship_ServiceExtrasText;
    data.Ship_ExtrasText = data.Ship_ExtrasText ? JSON.stringify(data.Ship_Extras) : data.Ship_ExtrasText;

    if (data.Ship_Receiver && Number(idEdit) == 0) {
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

      data.Ship_Receiver.Phone = data.Ship_Receiver.Phone || data.ReceiverPhone;
    }

    data.ReceiverDate = data.ReceiverDate || null;
    data.DateOrderRed = data.DateOrderRed || null;
    data.DateInvoice = data.DateInvoice || new Date();
    data.DateCreated = new Date();

    data.Phone = data.Phone || data.ReceiverPhone;

    // TODO: trường hợp edit
    if(data.Id && data.Id > 0) {
      data.OrderLines?.map((x: OrderLineV2) => {
        if (x.Id < 0) {
          x.Id = 0;
        }
        x.OrderId = data.Id;
        x.PartnerId = data.PartnerId;
        x.CompanyId = data.CompanyId;
        x.UserId = x.UserId || data.UserId;
        x.User = x.User || data.User;
      })
    }

    // TODO: trường hợp thêm mới
    else {
      let details: any = [];
      data.OrderLines?.forEach((x: OrderLineV2) => {

        let item = {
            Account: x.Account || data.Account,
            AccountId: x.Account?.Id || data.AccountId,
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
            User: x.User || data.User,
            UserId: x.UserId || data.UserId,
            Weight: x.Weight,
            WeightTotal: x.WeightTotal,
        } as any;

        if(x.LiveCampaign_DetailId) {
          item.LiveCampaign_DetailId = x.LiveCampaign_DetailId;
        }

        if(x.LiveCampaignQtyChange) {
          item.LiveCampaignQtyChange = x.LiveCampaignQtyChange;
        }

        if(x.OrderId) {
          item.OrderId = x.OrderId;
        }

        details.push(item);
      })

      data.OrderLines = [...details] as any;
    }

    if(!data.State && data.ShowState == 'Nháp') {
        data.State = 'draft';
    }

    return {...data};
  }
}
