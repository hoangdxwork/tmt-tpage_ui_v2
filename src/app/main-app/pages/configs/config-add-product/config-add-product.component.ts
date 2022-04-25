import { ConfigAddCategoryModalComponent } from './../components/config-add-category-modal/config-add-category-modal.component';
import { ProductTemplateOUMLineService } from './../../../services/product-template-uom-line.service';
import { ProductTemplateService } from './../../../services/product-template.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/main-app/services/product.service';
import { Router } from '@angular/router';
import { ConfigAddOriginCountryModalComponent } from '../components/config-add-origin-country-modal/config-add-origin-country-modal.component';
import { ConfigAddUOMModalComponent } from '../components/config-add-UOM-modal/config-add-UOM-modal.component';
import { ConfigAddVariantProductModalComponent } from './../components/config-add-variant-product-modal/config-add-variant-product-modal.component';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TDSSafeAny, TDSMessageService, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-add-product',
  templateUrl: './config-add-product.component.html',
  styleUrls: ['./config-add-product.component.scss']
})
export class ConfigAddProductComponent implements OnInit, OnDestroy {
  variantTableData:Array<TDSSafeAny> = [];
  productTypeList:Array<TDSSafeAny>  = [];
  categoryList:Array<TDSSafeAny>  = [];
  UOMPOList:Array<TDSSafeAny>  = [];
  UOMList:Array<TDSSafeAny>  = [];
  POSCategoryList:Array<TDSSafeAny> = [];
  trackingList:Array<TDSSafeAny> = [];
  producerList:Array<TDSSafeAny> = [];
  importerList:Array<TDSSafeAny> = [];
  distributorList:Array<TDSSafeAny> = [];
  originCountryList:Array<TDSSafeAny> = [];

  private destroy$ = new Subject<void>();

  addProductForm!: FormGroup;
  modelDefault:TDSSafeAny;
  

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private router:Router,
    private productService: ProductService,
    private productTemplateService: ProductTemplateService,
    private productTemplateOUMLine: ProductTemplateOUMLineService,
  ) { 
    this.loadProductTypeList();
    this.loadProductCategory();
    this.loadProductUOM();
    this.loadUOMs();
    this.loadPOSCategory();
    this.loadTrackingList();
    this.loadUOMAddType();
    this.loadOriginCountry();
    this.loadForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.getDefaultData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDefaultData(){
    this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        delete res['@odata.context'];
        this.modelDefault = res;
      }
    )
  }

  loadData(){
    this.variantTableData = [
      {
        id:1,
        name:'INV/2021/0304',
        price:100000,
        active:false
      }
    ];
  }

  loadProductTypeList(){
    this.productTypeList = [
      { value: 'product', text: 'Có thể lưu trữ' },
      { value: 'consu', text: 'Có thể tiêu thụ' },
      { value: 'service', text: 'Dịch vụ' }
    ];
  }

  loadProductCategory(){
    this.productService.getProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.categoryList = res.value;
      },
      error=>{
        this.message.error(error.error.message);
      }
    );
  }

  loadProductUOM(){
    this.productTemplateService.getProductUOM().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.UOMPOList = res.value;
      },
      error=>{
        this.message.error(error.error.message);
      }
    );
  }

  loadUOMs(){
    this.productTemplateOUMLine.getOUMs().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.UOMList = res.value;
      },
      err=>{
        this.message.error(err.error.message);
      }
    );
  }

  loadPOSCategory(){
    this.productTemplateService.getPOSCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.POSCategoryList = res.value;
      },
      err=>{
        this.message.error(err.error.message);
      }
    );
  }

  loadTrackingList(){
    this.trackingList = [
      { value: 'lot', text: 'Theo lô' },
      { value: 'none', text: 'Không theo dõi' },
    ];
  }

  loadOriginCountry(){
    this.productTemplateService.getOriginCountry().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.originCountryList = res.value;
      }
    )
  }

  loadUOMAddType() {
    this.productTemplateService.geUOMAddType().subscribe(
      (res: TDSSafeAny) => {
        this.producerList = res.value.filter((x: { Type: string; }) => x.Type === 'producer');
        this.importerList = res.value.filter((x: { Type: string; }) => x.Type === 'importer');
        this.distributorList = res.value.filter((x: { Type: string; }) => x.Type === 'distributor');
      }
    );
  }

  loadForm(){
    this.addProductForm = this.formBuilder.group({
      CheckOn: ['order'],//kiểm soát hóa đơn mua hàng: 'số lượng đặt hàng', 'số lượng nhận hàng'
      Active: [true], //hiệu lực
      AvailableInPOS: [true],//hiện trên điểm bán hàng
      AttributeLines: [null],
      Barcode: [null],
      BOMCount: [null],
      Categ: [null],
      CategCompleteName: [null],
      CategId: [null],
      CategName: [null],
      CategNameNoSign: [null],
      ComboPurchased: [null],
      CompanyId: [null],
      CompanyName: [null],
      CompanyNameNoSign: [null],
      CostMethod: [null],
      DateCreated: [null],
      DefaultCode: [null],
      Description: [null],
      DescriptionPurchase: [null],
      DescriptionSale: [null],
      DiscountPurchase: [null],
      DiscountSale: [null],
      Distributor: [null],
      DistributorAddress: [null],
      DistributorId: [null],
      DistributorName: [null],
      EAN13: [null],
      Element: [null],
      EnableAll: [false],
      Id: [null],
      Image: [null],
      Images: this.formBuilder.array([]),
      ImageUrl: [null],
      Importer: [null],
      ImporterAddress: [null],
      ImporterId: [null],
      ImporterName: [null],
      IncomingQty: [null],
      InfoWarning: [null],
      InitInventory: [null],
      InvoicePolicy: ['order'],//trên số lượng đặt hàng ,  delivery- trên số lượng đã giao
      IsCombo: [false],
      IsProductVariant: [false],
      Items: [null],
      LastUpdated: [null],
      ListPrice: [null],
      IsDiscount: [false],
      Name: [null, Validators.required],
      NameGet: [null],
      NameNoSign: [null],
      OriginCountry: [null],
      OriginCountryId: [null],
      OriginCountryName: [null],
      OutgoingQty: [null],
      POSCateg: [null],//nhóm pos
      POSCategId: [null],
      Producer: [null],
      ProducerAddress: [null],
      ProducerId: [null],
      ProducerName: [null],
      ProductSupplierInfos: [null],
      ProductVariantCount: [null],
      PropertyCostMethod: [null],
      PropertyStockProductionId: [null],
      PropertyValuation: [null],
      PurchaseMethod: ['receive'], //trên số lượng nhận hàng,  purchase-trên số lượng đặt hàng
      PurchaseOK: [true], //có thể mua
      PurchasePrice: [null],
      QtyAvailable: [null],
      SaleDelay: [null],
      SaleOK: [true],
      ShowType: [null],
      Specifications: [null],
      StandardPrice: [null],
      Tags: [null],
      Tracking: ['none'],
      Type: ['product'],
      UOM: [null],
      UOMCategId: [null],
      UOMId: [null],
      UOMLines: [null],
      UOMName: [null],
      UOMNameNoSign: [null],
      UOMPO: [null],
      UOMPOId: [null],
      UOMPOName: [null],
      UOMPONameNoSign: [null],
      UOMViewI: [null],
      UOSId: [null],
      Valuation: [null],
      VariantFirstId: [null],
      VariantFistId: [null],
      Version: [null],
      VirtualAvailable: [0],
      Volume: [0],
      Weight: [0],
      YearOfManufacture: [null],
      ZaloProductId: [null],
      url_add: [null]
    });
  }

  resetForm(){
    this.addProductForm.reset({
      Name: '',
      SaleOK: true,
      PurchaseOK: true,
      IsCombo: false,
      Active: false,
      AvailableInPOS: true,
      EnableAll: false,
      Type: '',
      DefaultCode: '',
      Barcode: '',
      Categ: '',
      Attribute: '',
      ListPrice: 0,
      StandardPrice: 0,
      UOMPO: '',
      UOM: '',
      CheckOn: 'order',
      Images: [],
      Tracking: 'none',
      Weight: 0,
      Volume: 0,
      POSCateg: '',
      Description: '',
      DescriptionSale: '',
      Producer: '',
      Importer: '',
      Distributor: '',
      OriginCountry: '',
      YearOfManufacture: 0,
      Element: '',
      Specifications: '',
      InfoWarning: ''
    });
  }

  getAvatar(url:string){
    console.log(url)
  }

  getImageList(images:Array<string>){
    console.log(images)
  }

  showAddVariantModal(){
    const modal = this.modalService.create({
      title: 'Thêm biến thể sản phẩm',
      content: ConfigAddVariantProductModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addCategory(){
    const modal = this.modalService.create({
      title: 'Thêm nhóm sản phẩm',
      content: ConfigAddCategoryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      this.loadProductCategory();
    });
  }

  addProducer(){
    const modal = this.modalService.create({
      title: 'Thêm nhà sản xuất',
      content: ConfigAddUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addImporter(){
    const modal = this.modalService.create({
      title: 'Thêm nhà nhập khẩu',
      content: ConfigAddUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addDistributor(){
    const modal = this.modalService.create({
      title: 'Thêm nhà phân phối',
      content: ConfigAddUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addOriginCountry(){
    const modal = this.modalService.create({
      title: 'Thêm xuất xứ',
      content: ConfigAddOriginCountryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addProduct(){

  }

  backToMain(){
    this.router.navigate(['configs/products']);
    // this.resetForm();
  }

  onSubmit(){
    if(this.modelDefault) {
      this.addProduct();
    }
    else {
      this.productTemplateService.getDefault().subscribe((res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.modelDefault = res;

        this.addProduct();
      });
    }
    this.router.navigate(['configs/products']);
  }


}
