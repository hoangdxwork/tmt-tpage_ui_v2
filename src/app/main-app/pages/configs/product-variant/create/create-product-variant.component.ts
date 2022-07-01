import { IRAttachmentDTO } from './../../../../dto/attachment/attachment.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';

import { ProductService } from 'src/app/main-app/services/product.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductDTO, ProductUOMDTO } from 'src/app/main-app/dto/product/product.dto';
import { POS_CategoryDTO } from 'src/app/main-app/dto/category/category.dto';
import { ProductUOMService } from 'src/app/main-app/services/product-uom.service';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadFile } from 'tds-ui/upload';

@Component({
  selector: 'create-product-variant',
  templateUrl: './create-product-variant.component.html',
})

export class CreateProductVariantComponent implements OnInit {
  _form!: FormGroup;
  lstAttributeValues: Array<ProductCategoryDTO> = [];
  lstUOM: Array<ProductUOMDTO> = [];
  lstUOMPO: Array<ProductUOMDTO> = [];
  lstPOSCateg: Array<POS_CategoryDTO> = [];
  listCateg = [
    { value: "product", text: "Có thể lưu trữ" },
    { value: "consu", text: "Có thể tiêu thụ" },
    { value: "service", text: "Dịch vụ" }
  ];
  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';
  modelDefault!: ProductDTO;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private router: Router,
    private message: TDSMessageService,
    private productService: ProductService,
    private productUOMService: ProductUOMService,
    private productCategoryService: ProductCategoryService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefault();
    this.loadAttributeValues();
    this.loadUOM();
    this.loadUOMPO();
  }

  loadDefault(){
    this.productService.getDefault().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      delete res['@odata.context'];
      this.modelDefault = res;
      this.formatProperty(res);
    });
  }

  loadAttributeValues() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstAttributeValues = res.value;
    }, err => {
      this.message.error(err?.error?.message || 'Load dữ liệu nhóm sản phẩm thất bại!')
    });
  }

  loadUOM() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstUOM = res.value;
    }, err => {
      this.message.error(err?.error?.message || 'Load dữ liệu đơn vị mặc định thất bại!')
    });
  }

  loadUOMPO() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstUOMPO = res.value;
    }, err => {
      this.message.error(err?.error?.message || 'Load dữ liệu đơn vị mua thất bại!')
    });
  }

  formatProperty(data: ProductDTO) {
    //TODO: xử lý array form
    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.forEach((x: IRAttachmentDTO) => {
          this.addImages(x);
      });
    }
    
    if (data.DateCreated) {
      data.DateCreated = new Date(data.DateCreated);
    }
    this._form.patchValue(data);
  }

  addImages(data: IRAttachmentDTO) {
    let control = <FormArray>this._form.controls['Images'];
    control.push(this.initImages(data));
  }

  initImages(data: IRAttachmentDTO | null) {
    if (data != null) {
      return this.fb.group({
          MineType: [data.MineType],
          Name: [data.Name],
          ResModel: ['product'],
          Type: ['url'],
          Url: [data.Url]
      })
    } else {
      return this.fb.group({
          MineType: [null],
          Name: [null],
          ResModel: ['product.template'],
          Type: ['url'],
          Url: [null]
      })
    }
  }

  createForm() {
    this._form = this.fb.group({
      Active: [true], //hiệu lực
      AmountTotal: [null],
      AttributeValues: [null], //nhóm
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
  }

  onBack() {
    this.router.navigateByUrl('/configs/product-variant');
  }

  onSave() {
    let model = this.prepareModel();
    if (!model.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
    this.productService.insertProduct(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success('Thêm mới thành công!');
      this.createForm();
      this.router.navigateByUrl('/configs/product-variant');
    }, error => {
      this.message.error('Thao tác thất bại!');
    });
  }

  getUrl(ev: string){
    this.modelDefault.ImageUrl = ev
  }

  prepareModel() {
    let formModel = this._form.value;
    if (formModel.Name) {
      this.modelDefault.Name = formModel.Name;
    }
    if (formModel.Image) {
      this.modelDefault.ImageUrl
    }
    if (formModel.SaleOK) {
      this.modelDefault.SaleOK = formModel.SaleOK;
    }
    if (formModel.PurchaseOK) {
      this.modelDefault.PurchaseOK = formModel.PurchaseOK;
    }
    if (formModel.PurchaseOK) {
      this.modelDefault.PurchaseOK = formModel.PurchaseOK;
    }
    if (formModel.Type) {
      this.modelDefault.Type = formModel.Type;
    }
    if (formModel.DefaultCode) {
      this.modelDefault.DefaultCode = formModel.DefaultCode;
    }
    if (formModel.Barcode) {
      this.modelDefault.Barcode = formModel.Barcode;
    }
    if (formModel.Categ) {
      let modelCateg = this.lstAttributeValues.find(x => x.Id == formModel.Categ)
      if (modelCateg) {
        this.modelDefault.Categ = modelCateg;
        this.modelDefault.CategId = modelCateg.Id;
      }
    } else {
      this.modelDefault.CategId = this.modelDefault.Categ.Id;
    }
    if (formModel.AttributeValues) {
      this.modelDefault.AttributeValues = formModel.AttributeValues;
    }
    if (formModel.Active) {
      this.modelDefault.Active = formModel.Active;
    }
    if (formModel.PriceVariant) {
      this.modelDefault.PriceVariant = formModel.PriceVariant;
    }
    if (formModel.StandardPrice) {
      this.modelDefault.StandardPrice = formModel.StandardPrice;
    }
    if (formModel.UOM) {
      let modelUOM = this.lstUOM.find(x => x.Id == formModel.UOM)
      if (modelUOM) {
        this.modelDefault.UOM = modelUOM;
        this.modelDefault.UOMId = modelUOM.Id;
      }
    } else {
      this.modelDefault.UOMId = this.modelDefault.UOM.Id;
    }
    if (formModel.UOMPO) {
      let modelUOMPO = this.lstUOMPO.find(x => x.Id == formModel.UOMPO)
      if (modelUOMPO) {
        this.modelDefault.UOMPO = modelUOMPO;
        this.modelDefault.UOMPOId = modelUOMPO.Id;
      }
    } else {
      this.modelDefault.UOMPOId = this.modelDefault.UOMPO.Id;
    }
    if (formModel.PurchaseMethod) {
      this.modelDefault.PurchaseMethod = formModel.PurchaseMethod;
    }
    if (formModel.Weight) {
      this.modelDefault.Weight = formModel.Weight;
    }
    if (formModel.SaleDelay) {
      this.modelDefault.SaleDelay = formModel.SaleDelay;
    }
    if (formModel.POSCateg) {
      let modelPOSCateg = this.lstPOSCateg.find(x => x.Id == formModel.UOMPO)
      if (modelPOSCateg) {
        this.modelDefault.POSCateg = modelPOSCateg;
        this.modelDefault.POSCategId = modelPOSCateg.Id;
      }else{
        this.modelDefault.POSCategId = this.modelDefault.POSCateg.Id;
      }
    }
    if (formModel.AvailableInPOS) {
      this.modelDefault.AvailableInPOS = formModel.AvailableInPOS;
    }
    if (formModel.InvoicePolicy) {
      this.modelDefault.InvoicePolicy = formModel.InvoicePolicy;
    }
    return this.modelDefault;
  }
}
