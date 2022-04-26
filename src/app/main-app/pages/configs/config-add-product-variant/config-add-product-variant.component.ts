import { POS_CategoryDTO } from './../../../dto/category/category.dto';
import { ProductUOMDTO } from './../../../dto/product/product-uom.dto';
import { ProductCategoryDTO } from './../../../dto/product/product-category.dto';
import { ProductCategoryService } from './../../../services/product-category.service';
import { ProductUOMService } from './../../../services/product-uom.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ProductDTO } from './../../../dto/product/product.dto';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TDSSafeAny, TDSMessageService, TDSUploadFile } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-config-add-product-variant',
  templateUrl: './config-add-product-variant.component.html',
  styleUrls: ['./config-add-product-variant.component.scss']
})
export class ConfigAddProductVariantComponent implements OnInit {
  listCateg: Array<TDSSafeAny> = [];
  lstAttributeValues: Array<ProductCategoryDTO> = [];
  lstUOM: Array<ProductUOMDTO> = [];
  lstUOMPO: Array<ProductUOMDTO> = [];
  lstPOSCateg: Array<POS_CategoryDTO> = [];

  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';

  addProductForm!: FormGroup;
  modelDefault!: ProductDTO;
  private destroy$ = new Subject<void>();

  constructor(
    private msg: TDSMessageService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private message: TDSMessageService,
    private productService: ProductService,
    private productUOMService: ProductUOMService,
    private productCategoryService: ProductCategoryService,
  ) {
    this.createForm();
    this.loadData();
  }

  ngOnInit(): void {
    this.productService.getDefault().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      delete res['@odata.context'];
      this.modelDefault = res;
      console.log(this.modelDefault)
    });
    this.loadCateg();
    // this.loadPOSCateg();
    this.loadAttributeValues();
    this.loadUOM();
    this.loadUOMPO();
    this.loadData();
  }

  loadData() {

  }

  loadCateg() {
    this.listCateg = [
      { value: "product", text: "Có thể lưu trữ" },
      { value: "consu", text: "Có thể tiêu thụ" },
      { value: "service", text: "Dịch vụ" }
    ];
  }

  loadAttributeValues() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstAttributeValues = res.value;
    }, err => {
      this.message.error('Load dữ liệu nhóm sản phẩm thất bại!')
    });
  }

  loadUOM() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstUOM = res.value;
    }, err => {
      this.message.error('Load dữ liệu đơn vị mặc định thất bại!')
    });
  }

  loadUOMPO() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstUOMPO = res.value;
    }, err => {
      this.message.error('Load dữ liệu đơn vị mua thất bại!')
    });
  }

  // loadPOSCateg() {
  //   this.productUOMService.getUOMCateg().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //     this.lstPOSCateg = res.value;
  //   }, err => {
  //     this.message.error('Load dữ liệu nhóm Pos thất bại!')
  //   });
  // }


  createForm() {
    this.addProductForm = this.formBuilder.group({
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
      OldPrice: [null],
      OutgoingQty: [null],
      POSCateg: [null],//nhóm pos
      POSCategId: [null],
      PosSalesCount: [null],
      Price: [null],
      PriceVariant: [null],//giá biến thể
      Product_UOMId: [null],
      ProductTmplEnableAll: [false],
      ProductTmplId: [null],
      PropertyCostMethod: [null],
      PropertyValuation: [null],
      PurchaseMethod: ['receive'], //trên số lượng nhận hàng,  purchase-trên số lượng đặt hàng
      PurchaseOK: [true], //có thể mua
      PurchasePrice: [null],
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

    this.addProductForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => { });
  }

  resetForm() {
    this.addProductForm.reset({
      name: '',
      sellable: false,
      buyable: false,
      active: false,
      pointOfSale: false,
      type: '',
      productCode: '',
      QRCode: '',
      group: '',
      attribute: '',
      variantPrice: 0,
      capital: 0,
      defaultUnit: '',
      unit: '',
      inventory: '1',
      netWeight: 0,
      timeOut: 0,
      PosGroup: '',
      salePolicy: '0',
    });
  }

  backToMain() {
    this.resetForm();
    this.router.navigate(['/configs/product-variant']);
  }

  onSave() {
    if (this.modelDefault) {
      this.addGeneralPackage();
    }
    else {
      this.productService.getDefault().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        delete res['@odata.context'];
        this.modelDefault = res;
        this.addGeneralPackage();
      });
    }

  }
  addGeneralPackage() {
    let model = this.prepareModel();

    if (!model.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
    } else {
      let data = JSON.stringify(model)
      this.productService.insertProduct(data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.message.success('Thêm mới thành công!');
        this.createForm();
        this.router.navigate(['/configs/product-variant']);
      }, error => {
        this.message.error('Thao tác thất bại!');
      });
    }
  }

  getUrl(ev: string){
    this.modelDefault.ImageUrl = ev
  }

  prepareModel() {
    let formModel = this.addProductForm.value;

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
    console.log(this.modelDefault)
    return this.modelDefault;
  }
}
