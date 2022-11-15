import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class CreateFormProductVariantHandler {

  public createForm(_form: FormGroup, fb: FormBuilder) {
    _form = fb.group({
      Active: [true], //hiệu lực
      AmountTotal: [null],
      AttributeValues: [null], //danh sách thuộc tính-giá trị của biến thể
      AvailableInPOS: [true],//hiện trên điểm bán hàng
      Barcode: [null],
      Categ: [null],
      CategId: [null],
      CategName: [null],
      CompanyId: [null],
      CostMethod: [null],
      DateCreated: [null],
      DefaultCode: [null],
      Description: [null],
      DiscountPurchase: [null],
      DiscountSale: [null],
      DisplayAttributeValues: [null],
      EAN13: [null],
      Factor: [null],
      Id: [null],
      Image: [null],
      ImageUrl: [null],
      IncomingQty: [null],
      InvoicePolicy: ['order'],//trên số lượng đặt hàng ,  delivery- trên số lượng đã giao
      IsCombo: [null],
      IsDiscount: [false],
      LastUpdated: [null],
      ListPrice: [0],
      Name: [null, Validators.required],
      NameCombos: [null],
      NameGet: [null],
      NameNoSign: [null],
      NameTemplate: [null],
      NameTemplateNoSign: [null],
      OldPrice: [0],
      OutgoingQty: [0],
      POSCateg: [null],//nhóm pos
      POSCategId: [null],
      PosSalesCount: [null],
      Price: [0],
      PriceVariant: [0],//giá biến thể
      Product_UOMId: [null],
      ProductTmplEnableAll: [false],
      ProductTmplId: [null],
      PropertyCostMethod: [null],
      PropertyValuation: [null],
      PurchaseMethod: ['receive'], //trên số lượng nhận hàng,  purchase-trên số lượng đặt hàng
      PurchaseOK: [true], //có thể mua
      PurchasePrice: [0],
      QtyAvailable: [0],
      RewardName: [null],
      SaleDelay: [null],//thời gian chờ
      SaleOK: [true], // có thể bán
      SaleValue: [null],
      StandardPrice: [0],//giá vốn
      StockValue: [null],
      Tags: [null],
      TaxesIds: [null],
      Tracking: [null],
      Type: ['product'],//consu//service
      UOM: [null],//Đơn vị mặc định
      UOMPO: [null],// UOMPO đơn vị mua
      UOMPOId: [null],
      Valuation: [null],
      Variant_TeamId: [null],
      Version: [null],
      VirtualAvailable: [0],
      Weight: [0], //tồn kho
    });

    return _form;
  }

  public createEditForm(_form: FormGroup, fb: FormBuilder) {
    _form = fb.group({
      Name: [null, Validators.required],
      PriceVariant: [0],
      IsAvailableOnTPage: [null],
      ImageUrl: [null],
      Categ: [null, Validators.required],
      UOM: [null, Validators.required],
      UOMPO: [null, Validators.required],
      Images: fb.array([]),
      OrderTag: [null],
    })

    return _form;
  }
}
