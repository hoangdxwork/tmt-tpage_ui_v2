import { SaleSettingsDTO } from './../../dto/setting/setting-sale-online.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from '../../dto/fastsaleorder/fastsaleorder-default.dto';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Injectable } from "@angular/core";

@Injectable()

export class UpdateOrderLinesHandler {
  constructor(private fb: FormBuilder){}

  public updateOrderLines(_form: FormGroup, data: FastSaleOrder_DefaultDTOV2) {

    if (TDSHelperArray.hasListValue(data.OrderLines)) {
      let formArray = <FormArray>_form.controls['OrderLines'];

      data.OrderLines?.forEach((item: OrderLineV2) => {
        formArray.push(this.initOrderLines(data,item));
      });
    }
  }

  public initOrderLines(dataModel: FastSaleOrder_DefaultDTOV2, data: OrderLineV2 | null) {

    if (data != null) {
      return this.fb.group({
        Id: [data.Id],
        ProductId: [data.ProductId],
        ProductUOMId: [data.ProductUOMId],
        PriceUnit: [data.PriceUnit],
        ProductUOMQty: [data.ProductUOMQty],
        UserId: [dataModel.UserId],
        Discount: [data.Discount],
        Discount_Fixed: [Number(data.Discount_Fixed)],
        PriceTotal: [Number(data.PriceTotal)],
        PriceSubTotal: [Number(data.PriceSubTotal)],
        Weight: [data.Weight],
        WeightTotal: [data.WeightTotal],
        AccountId: [data.AccountId || dataModel.AccountId],
        PriceRecent: [data.PriceRecent],
        Name: [data.Name],
        IsName: [data.IsName],
        LiveCampaign_DetailId: [data.LiveCampaign_DetailId],
        LiveCampaignQtyChange: [0],
        OrderId: [data.OrderId],
        ProductName: [data.ProductName],
        ProductUOMName: [data.ProductUOMName],
        SaleLineIds: [data.SaleLineIds],
        ProductNameGet: [data.ProductNameGet],
        SaleLineId: [data.SaleLineId],
        Type: [data.Type],
        PromotionProgramId: [data.PromotionProgramId],
        Note: [data.Note],
        ProductBarcode: [data.ProductBarcode],
        CompanyId: [dataModel?.Company?.Id],
        PartnerId: [dataModel?.Partner?.Id],
        PriceSubTotalSigned: [data.PriceSubTotalSigned],
        PromotionProgramComboId: [data.PromotionProgramComboId],
        Product: [data.Product],
        ProductUOM: [data.ProductUOM],
        Account: [data.Account || dataModel.Account],
        SaleLine: [data.SaleLine],
        User: [data.User]
      });
    } else {
      return this.fb.group({
        Id: [null],
        ProductId: [null],
        ProductUOMId: [null],
        PriceUnit: [0],
        ProductUOMQty: [0],
        UserId: [null],
        Discount: [0],
        Discount_Fixed: [0],
        PriceTotal: [0],
        PriceSubTotal: [0],
        Weight: [0],
        WeightTotal: [0],
        AccountId: [null],
        PriceRecent: [0],
        Name: [null],
        IsName: [false],
        LiveCampaign_DetailId: [null],
        LiveCampaignQtyChange: [0],
        OrderId: [null],
        ProductName: [null],
        ProductUOMName: [null],
        SaleLineIds: [],
        ProductNameGet: [null],
        SaleLineId: [null],
        Type: [null],
        PromotionProgramId: [null],
        Note: [null],
        ProductBarcode: [null],
        CompanyId: [null],
        PartnerId: [null],
        PriceSubTotalSigned: [null],
        PromotionProgramComboId: [null],
        Product: [null],
        ProductUOM: [null],
        Account: [null],
        SaleLine: [null],
        User: [null]
      });
    }
  }
}
