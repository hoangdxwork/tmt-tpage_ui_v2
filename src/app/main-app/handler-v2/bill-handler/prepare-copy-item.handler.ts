import { OrderLineV2, FastSaleOrder_DefaultDTOV2 } from './../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";
import { DataPouchDBDTO } from '@app/dto/product-pouchDB/product-pouchDB.dto';
import { FSOrderLines } from '@app/dto/fastsaleorder/fastsale-orderline.dto';

@Injectable()

export class PrepareCopyItemHandler {

    public prepareCopyModel(x: OrderLineV2, dataModel: FastSaleOrder_DefaultDTOV2): OrderLineV2 {

      x.UserId = x.UserId || dataModel.UserId;
      x.AccountId = x.AccountId || dataModel.Account?.Id;
      x.OrderId = dataModel.Id;
      x.CompanyId = x.CompanyId || dataModel.Company?.Id;
      x.User = x.User || dataModel.User;

      return {...x};
    }


    public prepareOnChangeProductModel(x: FSOrderLines, dataModel: FastSaleOrder_DefaultDTOV2, event?: DataPouchDBDTO): OrderLineV2 {

      let item: OrderLineV2  = {
        Id: 0,
        Product: event,
        ProductId: x.ProductId || event!.Id,
        ProductUOMId: x.ProductUOMId || event!.UOMId,
        PriceUnit: x.PriceUnit,
        PriceRecent: x.PriceRecent || null,
        ProductUOMQty: x.ProductUOMQty,
        Discount: x.Discount,
        Discount_Fixed: x.Discount_Fixed,
        PriceTotal: x.PriceTotal,
        PriceSubTotal: x.PriceSubTotal,
        Weight: x.Weight,
        WeightTotal: x.WeightTotal,
        AccountId: x.AccountId || x.Account?.Id,
        IsName: false,
        OrderId: dataModel.Id,
        ProductName: x.ProductName,
        ProductUOMName: x.ProductUOMName,
        SaleLineIds: [],
        ProductNameGet: x.ProductNameGet,
        Type: x.Type,
        ProductBarcode: x.ProductBarcode,
        PriceSubTotalSigned: 0,
        Account: x.Account,
        User: dataModel.User
      }

      return {...item};
    }
}
