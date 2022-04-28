import { ProductTemplateDTO } from './../../../dto/product/product.dto';
import { ConfigAddCategoryModalComponent } from './../components/config-add-category-modal/config-add-category-modal.component';
import { ProductTemplateOUMLineService } from './../../../services/product-template-uom-line.service';
import { ProductTemplateService } from './../../../services/product-template.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/main-app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigAddOriginCountryModalComponent } from '../components/config-add-origin-country-modal/config-add-origin-country-modal.component';
import { ConfigAddUOMModalComponent } from '../components/config-add-UOM-modal/config-add-UOM-modal.component';
import { ConfigAddVariantProductModalComponent } from './../components/config-add-variant-product-modal/config-add-variant-product-modal.component';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TDSSafeAny, TDSMessageService, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-edit-product',
  templateUrl: './config-edit-product.component.html',
  styleUrls: ['./config-edit-product.component.scss']
})
export class ConfigEditProductComponent implements OnInit, OnDestroy {
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
  attributeValueList:Array<TDSSafeAny> = [];

  private destroy$ = new Subject<void>();

  productId:TDSSafeAny;

  editProductForm!: FormGroup;
  productModel!:ProductTemplateDTO;
  
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
    private route: ActivatedRoute,
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
    this.productId = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getData(){
    this.productTemplateService.getProductTemplateById(this.productId).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        delete res['@odata.context'];
        this.productModel = res;

        if(this.productModel.ImageUrl){
          this.editProductForm.controls.ImageUrl.setValue(this.productModel.ImageUrl);
        }

        if(res.Images){
          let images = res.Images as Array<TDSSafeAny>;
          images.map(x => {
            this.addImages(x);
            
          });
        }
    
        console.log(this.productModel)
        this.editProductForm.patchValue(res);
      },
      err=>{
        this.message.error(err.error.message??'Tải dữ liệu thất bại')
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
    this.editProductForm = this.formBuilder.group({
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

  showAddVariantModal(){
    let modelData = {
      Name: this.editProductForm.controls.Name.value,
      Barcode: this.editProductForm.controls.Barcode.value,
      DefaultCode: this.editProductForm.controls.DefaultCode.value
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
          this.variantTableData.push(result);
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

  initImages(data: any | null) {
    if(data != null) {
      return this.formBuilder.group({
          MineType: [data.MineType],
          Name: [data.Name],
          ResModel: [data.ResModel],
          Type: [data.Type],
          Url: [data.Url]
      });
    } else {
      return this.formBuilder.group({
          MineType: [null],
          Name: [null],
          ResModel: [null],
          Type: [null],
          Url: [null]
      });
    }
  }

  addImages(data: any) {
    const model = <FormArray>this.editProductForm.controls['Images'];
    model.push(this.initImages(data));
  }

  getAvatar(url:string){
    this.editProductForm.controls.ImageUrl.setValue(url);
    this.editProductForm.controls.Image.setValue(url);
  }

  getImageList(images:Array<TDSSafeAny>){
    this.editProductForm.controls.Images = this.formBuilder.array([]);
    images.forEach(img => {
      this.addImages({
        MineType: img.type,
        Name: img.name,
        ResModel: 'product.template',
        Type: 'url',
        Url: img.url
      });
    });
  }

  editProduct(){
    let model = this.prepareModel();
    // console.log(model)
    if(model.Name){
      this.productTemplateService.updateProductTemplate(model).subscribe(
        (res:TDSSafeAny)=>{console.log(res)
          this.message.success('Cập nhật thành công');
          history.back();
        },
        err=>{
          this.message.error(err.error.message??'Thao tác thất bại');
        }
      );
    }
  }

  prepareModel(){
    let formModel = this.editProductForm.value;
    console.log(formModel)
    if(formModel.Name){
      this.productModel.Name = formModel.Name;
    }
    if(formModel.Image) {
      this.productModel.Image = formModel.Image;
    }
    if(formModel.Images) {
        this.productModel.Images = formModel.Images;
    }
    if(formModel.ImageUrl) {
      this.productModel.ImageUrl = formModel.ImageUrl;
    }
    if(formModel.SaleOK) {
        this.productModel.SaleOK = formModel.SaleOK;
    }
    if(formModel.PurchaseOK) {
        this.productModel.PurchaseOK = formModel.PurchaseOK;
    }
    if(formModel.IsCombo) {
        this.productModel.IsCombo = formModel.IsCombo;
    }
    if(formModel.AvailableInPOS) {
        this.productModel.AvailableInPOS = formModel.AvailableInPOS;
    }
    if(formModel.EnableAll) {
        this.productModel.EnableAll = formModel.EnableAll;
    }
    if(formModel.Type) {
        let modelType = this.productTypeList.find(x=>x.Id== formModel.Type);
        if(modelType){
          this.productModel.Type = modelType.Type;
        }
    }
    if(formModel.DefaultCode) {
        this.productModel.DefaultCode = formModel.DefaultCode;
    }
    if(formModel.Barcode) {
        this.productModel.Barcode = formModel.Barcode;
    }
    if(formModel.Categ) {
        let modelCateg = this.categoryList.find(x=>x.Id== formModel.Categ);
        if(modelCateg){
          this.productModel.Categ = modelCateg;
          this.productModel.CategId = modelCateg.Id;
          this.productModel.CategName = modelCateg.Name;
          this.productModel.CategNameNoSign = modelCateg.NameNoSign;
          this.productModel.CategCompleteName = modelCateg.CompleteName;
        }
    }
    if(formModel.Active) {
        this.productModel.Active = formModel.Active;
    }
    if(formModel.InitInventory) {
        this.productModel.InitInventory = formModel.InitInventory;
    }
    if(formModel.ListPrice) {
        this.productModel.ListPrice = formModel.ListPrice;
    }
    if(formModel.DiscountSale) {
        this.productModel.DiscountSale = formModel.DiscountSale;
    }
    if(formModel.PurchasePrice) {
        this.productModel.PurchasePrice = formModel.PurchasePrice;
    }
    if(formModel.DiscountPurchase) {
        this.productModel.DiscountPurchase = formModel.DiscountPurchase;
    }
    if(formModel.UOM) {
        let modelUOM = this.UOMList.find(x=>x.Id== formModel.UOM);
        if(modelUOM){
          this.productModel.UOM = modelUOM;
          this.productModel.UOMId = modelUOM.Id;
          this.productModel.UOMName = modelUOM.Name;
          this.productModel.UOMNameNoSign = modelUOM.NameNoSign;
        }
    }
    if(formModel.UOMPO) {
        let modelUOMPO = this.UOMPOList.find(x=>x.Id== formModel.UOMPO);
        if(modelUOMPO){
          this.productModel.UOMPO = modelUOMPO;
          this.productModel.UOMPOId = modelUOMPO.Id;
          this.productModel.UOMPOName = modelUOMPO.Name;
          this.productModel.UOMPONameNoSign = modelUOMPO.NameNoSign;
        }
    }
    if(formModel.Tracking) {
      let modelTracking = this.trackingList.find(x=>x.Id== formModel.Tracking);
      if(modelTracking){
        this.productModel.Tracking = modelTracking.Tracking;
      }
    }
    if(formModel.Weight) {
        this.productModel.Weight = formModel.Weight;
    }
    if(formModel.Volume) {
        this.productModel.Volume = formModel.Volume;
    }
    if(formModel.POSCateg) {
        let modelPOSCateg = this.POSCategoryList.find(x=>x.Id== formModel.POSCateg);
        if(modelPOSCateg){
          this.productModel.PosCategId = modelPOSCateg.Id;
        }
    }
    if(formModel.DescriptionSale) {
        this.productModel.DescriptionSale = formModel.DescriptionSale;
    }
    if(formModel.Description) {
        this.productModel.Description = formModel.Description;
    }
    if(formModel.Producer) {
        let modelProducer = this.producerList.find(x=>x.Id== formModel.Producer);
        if(modelProducer){
          this.productModel.Producer = modelProducer;
          this.productModel.ProducerId = modelProducer.Id;
          this.productModel.ProducerName = modelProducer.Name;
          this.productModel.ProducerAddress = modelProducer.Address;
        }
    }
    if(formModel.Importer) {
        let modelImporter = this.importerList.find(x=>x.Id== formModel.Importer);
        if(modelImporter){
          this.productModel.Importer = modelImporter;
          this.productModel.ImporterId = modelImporter.Id;
          this.productModel.ImporterName = modelImporter.Name;
          this.productModel.ImporterAddress = modelImporter.Address;
        }
    }
    if(formModel.Distributor) {
        let modelDistributor = this.distributorList.find(x=>x.Id== formModel.Distributor);
        if(modelDistributor){
          this.productModel.Distributor = modelDistributor;
          this.productModel.DistributorId = modelDistributor.Id;
          this.productModel.DistributorName = modelDistributor.Name;
          this.productModel.DistributorAddress = modelDistributor.Address;
        }
    }
    if(formModel.OriginCountry) {
        let modelOriginCountry = this.originCountryList.find(x=>x.Id== formModel.OriginCountry);
        if(modelOriginCountry){
          this.productModel.OriginCountry = modelOriginCountry;
          this.productModel.OriginCountryId = modelOriginCountry.Id;
          this.productModel.OriginCountryName = modelOriginCountry.Name;
        }
    }
    if(formModel.YearOfManufacture) {
      this.productModel.YearOfManufacture = formModel.YearOfManufacture;
    }
    if(formModel.Element) {
      this.productModel.Element = formModel.Element;
    }
    if(formModel.Specifications) {
      this.productModel.Specifications = formModel.Specifications;
    }
    if(formModel.InfoWarning) {
      this.productModel.InfoWarning = formModel.InfoWarning;
    }
    if(formModel.Description) {
      this.productModel.Description = formModel.Description;
    }
    // if(formModel.AttributeValues) {
    //   this.productModel.AttributeValues = formModel.AttributeValues;
    // }
    // if(this.productModel && this.productModel.AttributeLines) {
    //   let value = this.productModel.AttributeLines as TDSSafeAny[];

    //   let lines = value.forEach(line => {
    //     let id = line.Attribute.Id
    //     line["AttributeId"] = id;
    //   });

    //   this.productModel.AttributeLines = lines;
    // }

    return this.productModel;
  }

  backToMain(){
    history.back();
  }

  onSubmit(){
    this.editProduct();
  }
}