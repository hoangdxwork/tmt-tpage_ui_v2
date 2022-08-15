import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class CreateFormProductHandler {

  public createForm(_form: FormGroup, fb: FormBuilder) {
    _form = fb.group({
        Active: [true],
        AvailableInPOS: [true],
        Barcode: [null],
        Categ: [null],
        DefaultCode: [null],
        Description: [null],
        DescriptionSale: [null],
        Distributor: [null],
        Element: [null],
        EnableAll: [false],
        Image: [null],
        Images: fb.array([]),
        ImageUrl: [null],
        Importer: [null],
        InfoWarning: [null],
        IsCombo: [false],
        ListPrice: [null],
        Name: [null],
        OriginCountry: [null],
        POSCateg: [null],//TODO: nhóm pos
        Producer: [null],
        ProductVariants: fb.array([]),
        PurchaseOK: [true],
        SaleOK: [true],
        Specifications: [null],
        StandardPrice: [null],
        Tracking: ['none'],
        Type: ['product'],
        UOM: [null],
        UOMPO: [null],
        Volume: [0],
        Weight: [0],
        YearOfManufacture: [null]
      });

    return _form;
  }
}
