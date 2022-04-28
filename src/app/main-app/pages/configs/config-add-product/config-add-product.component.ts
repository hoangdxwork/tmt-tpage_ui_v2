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
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TDSSafeAny, TDSMessageService, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-add-product',
  templateUrl: './config-add-product.component.html',
  styleUrls: ['./config-add-product.component.scss']
})
export class ConfigAddProductComponent implements OnInit, OnDestroy {
  variantTableData:Array<TDSSafeAny> = [];
  AttributeTableData:Array<TDSSafeAny> = [];
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
  attributeValueList:Array<TDSSafeAny> = [];

  private destroy$ = new Subject<void>();

  addProductForm!: FormGroup;
  modelDefault:TDSSafeAny;
  imgList:Array<TDSSafeAny> = [];
  
  variantPageSize = 20;
  variantPageIndex = 1;
  isLoadingVariant = false;
  count = 1;

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
    this.loadAttributeValue();
    this.loadForm();
  }

  ngOnInit(): void {
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

  loadAttributeValue(){
    // this.productService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
    //   (res:TDSSafeAny)=>{
    //     this.count = res['@odata.count'];
    //     this.attributeValueList = res.value;
    //   },
    //   err=>{
    //     this.message.error('Tải dữ liệu thất bại');
    //   }
    // )
  }

  refreshVariantData(){
    this.variantPageIndex = 1;
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
    this.productTemplateService.getUOMAddType().subscribe(
      (res: TDSSafeAny) => {
        this.producerList = res.value.filter((x: { Type: string; }) => x.Type === 'producer');
        this.importerList = res.value.filter((x: { Type: string; }) => x.Type === 'importer');
        this.distributorList = res.value.filter((x: { Type: string; }) => x.Type === 'distributor');
      }
    );
  }

  loadForm(){
    this.addProductForm = this.formBuilder.group({
      Active: [true], //hiệu lực
      AvailableInPOS: [true],//hiện trên điểm bán hàng
      AttributeLines: [null],
      AttributeValues:[null],//thuộc tính
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
      UOM: [null,Validators.required],
      UOMCategId: [null],
      UOMId: [null],
      UOMLines: [null],
      UOMName: [null],
      UOMNameNoSign: [null],
      UOMPO: [null,Validators.required],
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

  showAddVariantModal(){
    let modelData = {
      Name: this.addProductForm.controls.Name.value,
      Barcode: this.addProductForm.controls.Barcode.value,
      DefaultCode: this.addProductForm.controls.DefaultCode.value
    }
    
    if(modelData.Name){
      const modal = this.modalService.create({
        title: 'Thêm biến thể sản phẩm',
        content: ConfigAddVariantProductModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          data: modelData
        }
      });
      
      modal.afterClose.subscribe(result => {
        if (TDSHelperObject.hasValue(result)) {
          // this.addProductForm.controls.AttributeLines.setValue(result.AttributeLines);
          // this.addProductForm.controls.AttributeValues.setValue(result.AttributeValues);
          // console.log(result)
          let productName = this.addProductForm.controls.Name.value;
          let lines = result.AttributeLines.Values as TDSSafeAny[];
          lines.forEach(line => {
            this.variantTableData.push({
              Name: `${productName} (${line.Name})`,
              ListPrice: result.ListPrice,
              Active: result.Active
            });
          });

          this.AttributeTableData.push(result.AttributeLines);
        }
      });
    }else{
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  addCategory(){
    const modal = this.modalService.create({
      title: 'Thêm nhóm sản phẩm',
      content: ConfigAddCategoryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
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
      componentParams: {
        type: 'producer'
      }
    });
    
    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
    });
  }

  addImporter(){
    const modal = this.modalService.create({
      title: 'Thêm nhà nhập khẩu',
      content: ConfigAddUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: 'importer'
      }
    });
    
    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
    });
  }

  addDistributor(){
    const modal = this.modalService.create({
      title: 'Thêm nhà phân phối',
      content: ConfigAddUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: 'distributor'
      }
    });
    
    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
    });
  }

  addOriginCountry(){
    const modal = this.modalService.create({
      title: 'Thêm xuất xứ',
      content: ConfigAddOriginCountryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });
    
    modal.afterClose.subscribe(result => {
      this.loadOriginCountry();
    });
  }

  getAvatar(url:string){
    this.addProductForm.controls.ImageUrl.setValue(url);
  }

  getImageList(images:Array<TDSSafeAny>){
    this.imgList = images;
  }

  insertImageToForm(){
    const model = <FormArray>this.addProductForm.controls['Images'];

    this.imgList.forEach(img => {
      let form = this.formBuilder.group({
        MineType: [img.type],
        Name: [img.name],
        ResModel: ['product.template'],
        Type: ['url'],
        Url: [img.url]
      });

      model.push(form);
    });
  }

  addProduct(){
    let model = this.prepareModel();
    console.log(model)
    if(model.Name){
      this.productTemplateService.insertProductTemplate(model).subscribe(
        (res:TDSSafeAny)=>{
          this.message.success('Thêm mới thành công');
          // console.log(res)
          this.addProductForm.reset();
          this.modelDefault = null;
          this.loadForm();
          history.back();
        },
        err=>{
          this.message.error(err.error.errors.model[0]??'Thao tác thất bại');
        }
      );
      
    }
  }

  prepareModel(){
    this.insertImageToForm();
    
    let formModel = this.addProductForm.value;
    
    if(formModel.Name){
      this.modelDefault.Name = formModel.Name;
    }
    if(formModel.Image) {
      this.modelDefault.Image = formModel.Image;
    }
    if(formModel.Images) {
        this.modelDefault.Images = formModel.Images;
    }
    if(formModel.ImageUrl) {
      this.modelDefault.ImageUrl = formModel.ImageUrl;
  }
    if(formModel.SaleOK) {
        this.modelDefault.SaleOK = formModel.SaleOK;
    }
    if(formModel.PurchaseOK) {
        this.modelDefault.PurchaseOK = formModel.PurchaseOK;
    }
    if(formModel.IsCombo) {
        this.modelDefault.IsCombo = formModel.IsCombo;
    }
    if(formModel.AvailableInPOS) {
        this.modelDefault.AvailableInPOS = formModel.AvailableInPOS;
    }
    if(formModel.EnableAll) {
        this.modelDefault.EnableAll = formModel.EnableAll;
    }
    if(formModel.Type) {
      this.modelDefault.Type = formModel.Type;
    }
    if(formModel.DefaultCode) {
        this.modelDefault.DefaultCode = formModel.DefaultCode;
    }
    if(formModel.Barcode) {
        this.modelDefault.Barcode = formModel.Barcode;
    }
    if(formModel.Categ) {
        let modelCateg = this.categoryList.find(x=>x.Id== formModel.Categ);
        if(modelCateg){
          this.modelDefault.Categ = modelCateg;
          this.modelDefault.CategId = modelCateg.Id;
          this.modelDefault.CategName = modelCateg.Name;
          this.modelDefault.CategNameNoSign = modelCateg.NameNoSign;
          this.modelDefault.CategCompleteName = modelCateg.CompleteName;
        }
    } else {
        this.modelDefault.CategId =   this.modelDefault.Categ.Id;
        this.modelDefault.CategName =   this.modelDefault.Categ.Name;
        this.modelDefault.CategNameNoSign =   this.modelDefault.Categ.NameNoSign;
        this.modelDefault.CategCompleteName =   this.modelDefault.Categ.CompleteName;
    }
    if(formModel.Active) {
        this.modelDefault.Active = formModel.Active;
    }
    if(formModel.InitInventory) {
        this.modelDefault.InitInventory = formModel.InitInventory;
    }
    if(formModel.ListPrice) {
        this.modelDefault.ListPrice = formModel.ListPrice;
    }
    if(formModel.DiscountSale) {
        this.modelDefault.DiscountSale = formModel.DiscountSale;
    }
    if(formModel.PurchasePrice) {
        this.modelDefault.PurchasePrice = formModel.PurchasePrice;
    }
    if(formModel.DiscountPurchase) {
        this.modelDefault.DiscountPurchase = formModel.DiscountPurchase;
    }
    if(formModel.UOM) {
        let modelUOM = this.UOMList.find(x=>x.Id== formModel.UOM);
        if(modelUOM){
          this.modelDefault.UOM = modelUOM;
          this.modelDefault.UOMId = modelUOM.Id;
          this.modelDefault.UOMName = modelUOM.Name;
          this.modelDefault.UOMNameNoSign = modelUOM.NameNoSign;
        }
    } else {
      this.modelDefault.UOMId = this.modelDefault.UOM.Id;
      this.modelDefault.UOMId = this.modelDefault.UOM.Name;
      this.modelDefault.UOMId = this.modelDefault.UOM.NameNoSign;
    }
    if(formModel.UOMPO) {
        let modelUOMPO = this.UOMPOList.find(x=>x.Id== formModel.UOMPO);
        if(modelUOMPO){
          this.modelDefault.UOMPO = modelUOMPO;
          this.modelDefault.UOMPOId = modelUOMPO.Id;
          this.modelDefault.UOMPOName = modelUOMPO.Name;
          this.modelDefault.UOMPONameNoSign = modelUOMPO.NameNoSign;
        }
    } else {
        this.modelDefault.UOMPOId = this.modelDefault.UOMPO.Id;
        this.modelDefault.UOMPOName = this.modelDefault.UOMPO.Name;
        this.modelDefault.UOMPONameNoSign = this.modelDefault.UOMPO.NameNoSign;
    }
    if(formModel.PurchaseMethod){
      this.modelDefault.PurchaseMethod = formModel.PurchaseMethod;
    }
    if(formModel.Tracking) {
      this.modelDefault.Tracking = formModel.Tracking;
    }
    if(formModel.Weight) {
        this.modelDefault.Weight = formModel.Weight;
    }
    if(formModel.Volume) {
        this.modelDefault.Volume = formModel.Volume;
    }
    if(formModel.POSCateg) {
        let modelPOSCateg = this.POSCategoryList.find(x=>x.Id== formModel.POSCateg);
        if(modelPOSCateg){
          this.modelDefault.PosCategId = modelPOSCateg.Id;
        }
    }
    if(formModel.DescriptionSale) {
        this.modelDefault.DescriptionSale = formModel.DescriptionSale;
    }
    if(formModel.Description) {
        this.modelDefault.Description = formModel.Description;
    }
    if(formModel.Producer) {
        let modelProducer = this.producerList.find(x=>x.Id== formModel.Producer);
        if(modelProducer){
          this.modelDefault.Producer = modelProducer;
          this.modelDefault.ProducerId = modelProducer.Id;
          this.modelDefault.ProducerName = modelProducer.Name;
          this.modelDefault.ProducerAddress = modelProducer.Address;
        }else{
          this.modelDefault.ProducerId = this.modelDefault.Producer.Id;
          this.modelDefault.ProducerName = this.modelDefault.Producer.Name;
          this.modelDefault.ProducerAddress = this.modelDefault.Producer.Address;
        }
    }
    if(formModel.Importer) {
        let modelImporter = this.importerList.find(x=>x.Id== formModel.Importer);
        if(modelImporter){
          this.modelDefault.Importer = modelImporter;
          this.modelDefault.ImporterId = modelImporter.Id;
          this.modelDefault.ImporterName = modelImporter.Name;
          this.modelDefault.ImporterAddress = modelImporter.Address;
        }else{
          this.modelDefault.ImporterId = this.modelDefault.Importer.Id;
          this.modelDefault.ImporterName = this.modelDefault.Importer.Name;
          this.modelDefault.ImporterAddress = this.modelDefault.Importer.Address;
        }
    }
    if(formModel.Distributor) {
        let modelDistributor = this.distributorList.find(x=>x.Id== formModel.Distributor);
        if(modelDistributor){
          this.modelDefault.Distributor = modelDistributor;
          this.modelDefault.DistributorId = modelDistributor.Id;
          this.modelDefault.DistributorName = modelDistributor.Name;
          this.modelDefault.DistributorAddress = modelDistributor.Address;
        }else{
          this.modelDefault.DistributorId = this.modelDefault.Distributor.Id;
          this.modelDefault.DistributorName = this.modelDefault.Distributor.Name;
          this.modelDefault.DistributorAddress = this.modelDefault.Distributor.Address;
        }
    }
    if(formModel.OriginCountry) {
        let modelOriginCountry = this.originCountryList.find(x=>x.Id== formModel.OriginCountry);
        if(modelOriginCountry){
          this.modelDefault.OriginCountry = modelOriginCountry;
          this.modelDefault.OriginCountryId = modelOriginCountry.Id;
          this.modelDefault.OriginCountryName = modelOriginCountry.Name;
        }else{
          this.modelDefault.OriginCountryId = this.modelDefault.OriginCountry.Id;
          this.modelDefault.OriginCountryName = this.modelDefault.OriginCountry.Name;
        }
    }
    if(formModel.YearOfManufacture) {
      this.modelDefault.YearOfManufacture = formModel.YearOfManufacture;
    }
    if(formModel.Element) {
      this.modelDefault.Element = formModel.Element;
    }
    if(formModel.Specifications) {
      this.modelDefault.Specifications = formModel.Specifications;
    }
    if(formModel.InfoWarning) {
      this.modelDefault.InfoWarning = formModel.InfoWarning;
    }
    if(formModel.Description) {
      this.modelDefault.Description = formModel.Description;
    }
    if(formModel.AttributeValues) {
      this.modelDefault.AttributeValues = formModel.AttributeValues;
    }
    if(this.modelDefault && this.modelDefault.AttributeLines) {
      this.modelDefault.AttributeLines = formModel.AttributeLines;
    }

    return this.modelDefault;
  }

  backToMain(){
    history.back();
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
  }
}
