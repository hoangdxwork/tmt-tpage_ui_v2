import { ConfigImage, ConfigCateg, ConfigUOMPO, ConfigUOM, ConfigAttributeLine, ConfigSuggestVariants } from './../../../dto/configs/product/config-product-default.dto';
import { ConfigUOMTypeDTO, ConfigOriginCountryDTO } from './../../../dto/configs/product/config-UOM-type.dto';
import { ConfigProductVariant, ConfigAttributeValue } from '../../../dto/configs/product/config-product-default.dto';
import { ConfigAddAttributeProductModalComponent } from './../components/config-add-attribute-product-modal/config-add-attribute-product-modal.component';
import { ConfigAddCategoryModalComponent } from './../components/config-add-category-modal/config-add-category-modal.component';
import { ProductTemplateOUMLineService } from './../../../services/product-template-uom-line.service';
import { ProductTemplateService } from './../../../services/product-template.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ConfigAddOriginCountryModalComponent } from '../components/config-add-origin-country-modal/config-add-origin-country-modal.component';
import { ConfigAddUOMModalComponent } from '../components/config-add-UOM-modal/config-add-UOM-modal.component';
import { ConfigAddVariantProductModalComponent } from './../components/config-add-variant-product-modal/config-add-variant-product-modal.component';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TDSSafeAny, TDSMessageService, TDSModalService, TDSHelperObject, TDSHelperArray } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConfigProductDefaultDTO } from 'src/app/main-app/dto/configs/product/config-product-default.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-config-add-product',
  templateUrl: './config-add-product.component.html'
})
export class ConfigAddProductComponent implements OnInit, OnDestroy {
  _form!: FormGroup;

  productTypeList:Array<TDSSafeAny>  = [];
  categoryList:Array<ConfigCateg>  = [];
  UOMPOList:Array<ConfigUOMPO>  = [];
  UOMList:Array<ConfigUOM>  = [];
  POSCategoryList:Array<TDSSafeAny> = [];
  trackingList:Array<TDSSafeAny> = [];
  producerList:Array<ConfigUOMTypeDTO> = [];
  importerList:Array<ConfigUOMTypeDTO> = [];
  distributorList:Array<ConfigUOMTypeDTO> = [];
  originCountryList:Array<ConfigOriginCountryDTO> = [];
  attributeValuesList:Array<ConfigAttributeValue> = [];
  lstAttributes:Array<ConfigAttributeLine> = [];
  lstVariants:Array<ConfigProductVariant> = [];
  lsImages:Array<ConfigImage> = [];

  private destroy$ = new Subject<void>();

  dataModel!: ConfigProductDefaultDTO;
  
  isLoadingVariant = false;
  isLoadingAttribute = false;
  id: TDSSafeAny;

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productTemplateService: ProductTemplateService,
    private productTemplateOUMLine: ProductTemplateOUMLineService) { 
    this.createForm();
  }

  createForm(){
    this._form = this.fb.group({
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
      Images: this.fb.array([]),
      ImageUrl: [null],
      Importer: [null],
      InfoWarning: [null],
      InvoicePolicy: ['order'],//TODO: trên số lượng đặt hàng ,  delivery- trên số lượng đã giao
      IsCombo: [false],
      ListPrice: [null],
      Name: [null, Validators.required],
      OriginCountry: [null],
      POSCateg: [null],//TODO: nhóm pos
      Producer: [null],
      ProductVariants: this.fb.array([]),
      PurchaseMethod: ['receive'], //TODO: trên số lượng nhận hàng,  purchase-trên số lượng đặt hàng
      PurchaseOK: [true],
      SaleOK: [true],
      Specifications: [null],
      StandardPrice: [null],
      Tracking: ['none'],
      Type: ['product'],
      UOM: [null,Validators.required],
      UOMPO: [null,Validators.required],
      Volume: [0],
      Weight: [0],
      YearOfManufacture: [null]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.loadData(this.id);
    } else {
      this.loadDefault();
    }
    this.loadProductTypeList();
    this.loadProductCategory();
    this.loadProductUOM();
    this.loadUOMs();
    this.loadPOSCategory();
    this.loadTrackingList();
    this.loadUOMAddType();
    this.loadOriginCountry();
    this.loadAttributeValues();
  }

  loadData(id :TDSSafeAny) {
    this.productTemplateService.getProductTemplateById(id).pipe(takeUntil(this.destroy$))
      .subscribe((res :TDSSafeAny) => {
          delete res['@odata.context'];
          if (res.ImageUrl) {
            this._form.controls['ImageUrl'].setValue(res.ImageUrl);
          }
          this.dataModel = res;
          this.formatProperty(res);
    }, error => {
      this.message.error('Không thể tải dữ liệu');
    })
  }

  loadDefault(){
    this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$))
      .subscribe((res:TDSSafeAny) => {
        delete res['@odata.context'];
        this.dataModel = res;
        this.formatProperty(res);
      }, error => {
        this.message.error('Không thể tải dữ liệu mặc định');
      })
  }

  formatProperty(data: ConfigProductDefaultDTO) {
    //TODO: xử lý array form
    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.forEach((x: ConfigImage) => {
          this.addImages(x);
      });
    }
    if (TDSHelperArray.hasListValue(data.ProductVariants)) {
      data.ProductVariants.forEach((x: ConfigProductVariant) => {
          this.addProductVariants(x);
      });
      this.lstVariants = data.ProductVariants;
    }
    if (data.DateCreated) {
      data.DateCreated = new Date(data.DateCreated);
    }
    this._form.patchValue(data);
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
      }, error=>{
        this.message.error('không thể tải dữ liệu nhóm sản phẩm');
      }
    );
  }

  loadProductUOM(){
    this.productTemplateService.getProductUOM().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.UOMPOList = res.value;
      },
      error=>{
        this.message.error('Không thể tải dữ liệu UOMPO');
      }
    );
  }

  loadUOMs(){
    this.productTemplateOUMLine.getOUMs().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.UOMList = res.value;
      },
      err=>{
        this.message.error('Không thể tải dữ liệu UOM');
      }
    );
  }

  loadPOSCategory(){
    this.productTemplateService.getPOSCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.POSCategoryList = res.value;
      },
      err=>{
        this.message.error('Không thể tải dữ liệu nhóm POS');
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
      },
      err=>{
        this.message.error('Không thể tải dữ liệu origin country');
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

  loadAttributeValues(){
    this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.attributeValuesList = res.value;
      },
      err=>{
        this.message.error(err.error.message??'Tải dữ liệu biến thể thất bại');
      }
    )
  }

  showCreateAttributeModal(){
    let productName = this._form.controls.Name.value;
    if(productName){
      const modal = this.modalService.create({
        title: 'Quản lý thuộc tính',
        content: ConfigAddAttributeProductModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
      });
      
      modal.afterClose.subscribe((result:Array<ConfigAttributeLine>) => {
        if (TDSHelperObject.hasValue(result)) {
          this.lstAttributes = result;
          let model = <ConfigSuggestVariants> <unknown> this.prepareModel();
          model.AttributeLines = result;
          this.productTemplateService.suggestVariants({"model":model}).pipe(takeUntil(this.destroy$)).subscribe(
            (res)=>{
              this.lstVariants = res.value;
              this.dataModel.ProductVariants = this.lstVariants;
            },
            (err)=>{
              this.message.error('Không thể tải dữ liệu biến thể');
            }
          )
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
    this._form.controls.ImageUrl.setValue(url);
  }

  getImageList(images:Array<ConfigImage>){
    if (TDSHelperArray.hasListValue(images)) {
      this.lsImages = images;
    }
  }

  initImages(data: ConfigImage | null) {
    if (data != null) {
      return this.fb.group({
          MineType: [data.MineType],
          Name: [data.Name],
          ResModel: ['product.template'],
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

  initProductVariants(data: ConfigProductVariant | null) {
    if (data != null) {
      return this.fb.group(data)
    } else {
      return this.fb.group([null])
    }
  }

  addImages(data: ConfigImage) {
    let control = <FormArray>this._form.controls['Images'];
    control.push(this.initImages(data));
  }

  addProductVariants(data: ConfigProductVariant){
    let control = <FormArray>this._form.controls['ProductVariants'];
    control.push(this.initProductVariants(data));
  }

  addProduct(){
    let model = this.prepareModel();
    console.log(model)
    if(model.Name){
      this.productTemplateService.insertProductTemplate(model).subscribe(
        (res:TDSSafeAny)=>{
          this.message.success('Thêm mới thành công');
          this.createForm();
          history.back();
          console.log(res)
        },
        err=>{
          this.message.error(err.error.errors.model[0]??'Thao tác thất bại');
        }
      );
    }
  }

  editProduct(){
    let model = this.prepareModel();
    
    if(model.Name){
      this.productTemplateService.updateProductTemplate(model).subscribe(
        (res:TDSSafeAny)=>{
          this.message.success('Cập nhật thành công');
          this.createForm();
          history.back();
        },
        err=>{
          this.message.error(err.error.message??'Thao tác thất bại');
        }
      );
    }
  }

  prepareModel(){
    this.lsImages.forEach((x: ConfigImage) => {
      this.addImages(x);
    });
    let formModel = this._form.value;
    
    this.dataModel.Name = formModel.Name ? formModel.Name : this.dataModel.Name;
    this.dataModel.Image = formModel.Image ? formModel.Image: this.dataModel.Image;
    this.dataModel.Images = formModel.Images ? formModel.Images : this.dataModel.Images;
    this.dataModel.ImageUrl = formModel.ImageUrl ? formModel.ImageUrl: this.dataModel.ImageUrl;
    this.dataModel.SaleOK = formModel.SaleOK ? formModel.SaleOK : this.dataModel.SaleOK;
    this.dataModel.PurchaseOK = formModel.PurchaseOK ? formModel.PurchaseOK : this.dataModel.PurchaseOK;
    this.dataModel.IsCombo = formModel.IsCombo ? formModel.IsCombo : this.dataModel.IsCombo;
    this.dataModel.Active = formModel.Active ? formModel.Active : this.dataModel.Active;
    this.dataModel.AvailableInPOS = formModel.AvailableInPOS ? formModel.AvailableInPOS : this.dataModel.AvailableInPOS;
    this.dataModel.EnableAll = formModel.EnableAll ? formModel.EnableAll : this.dataModel.EnableAll;
    this.dataModel.Type = formModel.Type ? formModel.Type : this.dataModel.Type;
    this.dataModel.DefaultCode = formModel.DefaultCode ? formModel.DefaultCode : this.dataModel.DefaultCode;
    this.dataModel.Barcode = formModel.Barcode ? formModel.Barcode : this.dataModel.Barcode;
    this.dataModel.StandardPrice = formModel.StandardPrice ? formModel.StandardPrice : this.dataModel.StandardPrice;
    this.dataModel.ListPrice = formModel.ListPrice ? formModel.ListPrice : this.dataModel.ListPrice;
    this.dataModel.DiscountSale = formModel.DiscountSale ? formModel.DiscountSale : this.dataModel.DiscountSale;
    this.dataModel.PurchasePrice = formModel.PurchasePrice ? formModel.PurchasePrice : this.dataModel.PurchasePrice;
    this.dataModel.DiscountPurchase = formModel.DiscountPurchase ? formModel.DiscountPurchase : this.dataModel.DiscountPurchase;
    this.dataModel.PurchaseMethod = formModel.PurchaseMethod ? formModel.PurchaseMethod : this.dataModel.PurchaseMethod;
    this.dataModel.Tracking = formModel.Tracking ? formModel.Tracking : this.dataModel.Tracking;
    this.dataModel.Weight = formModel.Weight ? formModel.Weight : this.dataModel.Weight;
    this.dataModel.Volume = formModel.Volume ? formModel.Volume : this.dataModel.Volume;
    this.dataModel.DescriptionSale = formModel.DescriptionSale ? formModel.DescriptionSale : this.dataModel.DescriptionSale;
    this.dataModel.Description = formModel.Description ? formModel.Description : this.dataModel.Description;
    this.dataModel.YearOfManufacture = formModel.YearOfManufacture ? formModel.YearOfManufacture : this.dataModel.YearOfManufacture;
    this.dataModel.Element = formModel.Element ? formModel.Element : this.dataModel.Element;
    this.dataModel.Specifications = formModel.Specifications ? formModel.Specifications : this.dataModel.Specifications;
    this.dataModel.InfoWarning = formModel.InfoWarning ? formModel.InfoWarning : this.dataModel.InfoWarning;
    this.dataModel.Description = formModel.Description ? formModel.Description : this.dataModel.Description;
    if(formModel.Categ) {
        this.dataModel.Categ = formModel.Categ;
        this.dataModel.CategId = formModel.Categ.Id;
        this.dataModel.CategName = formModel.Categ.Name;
        this.dataModel.CategNameNoSign = formModel.Categ.NameNoSign;
        this.dataModel.CategCompleteName = formModel.Categ.CompleteName;
    } else {
        this.dataModel.CategId = this.dataModel.Categ.Id;
        this.dataModel.CategName = this.dataModel.Categ.Name;
        this.dataModel.CategNameNoSign = this.dataModel.Categ.NameNoSign;
        this.dataModel.CategCompleteName = this.dataModel.Categ.CompleteName;
    }
    if(formModel.UOM) {
        this.dataModel.UOM = formModel.UOM;
        this.dataModel.UOMId = formModel.UOM.Id;
        this.dataModel.UOMName = formModel.UOM.Name;
        this.dataModel.UOMNameNoSign = formModel.UOM.NameNoSign;
    } else {
      this.dataModel.UOMId = this.dataModel.UOM.Id;
      this.dataModel.UOMName = this.dataModel.UOM.Name;
      this.dataModel.UOMId = this.dataModel.UOM.NameNoSign;
    }
    if(formModel.UOMPO) {
        this.dataModel.UOMPO = formModel.UOMPO;
        this.dataModel.UOMPOId = formModel.UOMPO.Id;
        this.dataModel.UOMPOName = formModel.UOMPO.Name;
        this.dataModel.UOMPONameNoSign = formModel.UOMPO.NameNoSign;
    } else {
        this.dataModel.UOMPOId = this.dataModel.UOMPO.Id;
        this.dataModel.UOMPOName = this.dataModel.UOMPO.Name;
        this.dataModel.UOMPONameNoSign = this.dataModel.UOMPO.NameNoSign;
    }
    if(formModel.POSCateg) {
        this.dataModel.POSCategId = formModel.POSCateg.Id;
    }
    if(formModel.Producer) {
        this.dataModel.Producer = formModel.Producer;
        this.dataModel.ProducerId = formModel.Producer.Id;
        this.dataModel.ProducerName = formModel.Producer.Name;
        this.dataModel.ProducerAddress = formModel.Producer.Address;
    }else{
      if(this.dataModel.Producer){
        this.dataModel.ProducerId = this.dataModel.Producer.Id;
        this.dataModel.ProducerName = this.dataModel.Producer.Name;
        this.dataModel.ProducerAddress = this.dataModel.Producer.Address;
      }
    }
    if(formModel.Importer) {
        this.dataModel.Importer = formModel.Importer;
        this.dataModel.ImporterId = formModel.Importer.Id;
        this.dataModel.ImporterName = formModel.Importer.Name;
        this.dataModel.ImporterAddress = formModel.Importer.Address;
    }else{
      if(this.dataModel.Importer){
        this.dataModel.ImporterId = this.dataModel.Importer.Id;
        this.dataModel.ImporterName = this.dataModel.Importer.Name;
        this.dataModel.ImporterAddress = this.dataModel.Importer.Address;
      }
    }
    if(formModel.Distributor) {
        this.dataModel.Distributor = formModel.Distributor;
        this.dataModel.DistributorId = formModel.Distributor.Id;
        this.dataModel.DistributorName = formModel.Distributor.Name;
        this.dataModel.DistributorAddress = formModel.Distributor.Address;
    }else{
      if(this.dataModel.Distributor){
        this.dataModel.DistributorId = this.dataModel.Distributor.Id;
        this.dataModel.DistributorName = this.dataModel.Distributor.Name;
        this.dataModel.DistributorAddress = this.dataModel.Distributor.Address;
      }
    }
    if(formModel.OriginCountry) {
      this.dataModel.OriginCountry = formModel.OriginCountry;
      this.dataModel.OriginCountryId = formModel.OriginCountry.Id;
      this.dataModel.OriginCountryName = formModel.OriginCountry.Name;
    }else{
      if(this.dataModel.OriginCountry){
        this.dataModel.OriginCountryId = this.dataModel.OriginCountry.Id;
        this.dataModel.OriginCountryName = this.dataModel.OriginCountry.Name;
      }
    }
    
    return this.dataModel;
  }

  backToMain(){
    history.back();
  }

  onSubmit(){
    if(this.id){
      this.editProduct();
    }else{
      if(this.dataModel) {
        this.addProduct();
      } else {
        this.productTemplateService.getDefault().subscribe((res: TDSSafeAny) => {
          delete res['@odata.context'];
          this.dataModel = res;
          this.addProduct();
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}