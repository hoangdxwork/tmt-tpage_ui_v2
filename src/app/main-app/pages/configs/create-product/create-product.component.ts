import { SaleSettingConfigDto_V2 } from './../../../dto/setting/sale-setting-config.dto';
import { UserInitDTO } from 'src/app/lib/dto';
import { TAuthService } from 'src/app/lib';
import { ProductTemplateDto, ProductCategoryDto, ProductUOMPODto, ProductUOMDto, ProductUOMLineDto } from './../../../dto/configs/product/config-product-default-v2.dto';
import { ProductVariantDto, AttributeLineDto } from './../../../dto/configs/product/config-product-variant.dto';
import { CompanyCurrentDTO } from './../../../dto/configs/company-current.dto';
import { ProductService } from '@app/services/product.service';
import { SharedService } from './../../../services/shared.service';
import { ProductTemplateFacade } from './../../../services/facades/product-template.facade';
import { CreateUnitComponent } from './../components/create-unit/create-unit.component';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexdb.service';
import { UpdateInitInventoryComponent } from './../components/update-init-inventory/update-init-inventory.component';
import { StockChangeProductQtyDTO } from './../../../dto/product/stock-change-product-qty.dto';
import { StockChangeProductQtyService } from './../../../services/stock-change-product-qty.service';
import { ProductComboDto } from './../../../dto/product/product-combo.dto';
import { CreateComboModalComponent } from './../components/create-combo-modal/create-combo-modal.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TpageAddCategoryComponent } from '../../../shared/tpage-add-category/tpage-add-category.component';
import { ProductCategoryService } from '../../../services/product-category.service';
import { WallPicturesDTO } from '../../../dto/attachment/wall-pictures.dto';
import { Message } from '../../../../lib/consts/message.const';
import { CreateVariantsModalComponent } from '../components/create-variants-modal/create-variants-modal.component';
import { ProductUOMTypeDto, OriginCountryDto } from '../../../dto/configs/product/config-UOM-type.dto';
import { ConfigAddAttributeProductModalComponent } from '../components/config-attribute-modal/config-attribute-modal.component';
import { ProductTemplateUOMLineService } from '../../../services/product-template-uom-line.service';
import { ProductTemplateService } from '../../../services/product-template.service';
import { CreateCountryModalComponent } from '../components/create-country-modal/create-country-modal.component';
import { CreateUOMModalComponent } from '../components/create-UOM-modal/create-UOM-modal.component';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { CreateFormProductHandler } from 'src/app/main-app/handler-v2/product/create-form-product.handler';
import { AddProductHandler } from 'src/app/main-app/handler-v2/product/prepare-create-product.handler';
import { TDSConfigService } from 'tds-ui/core/config';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  host: {
    class: 'w-full h-full flex'
  },
  providers: [TDSDestroyService]
})
export class ConfigAddProductComponent implements OnInit {
  
  _form!: FormGroup;
  productTypeList: Array<TDSSafeAny> = [];
  categoryList: Array<ProductCategoryDto> = [];
  UOMPOList: Array<ProductUOMPODto> = [];
  UOMList: Array<ProductUOMDto> = [];
  POSCategoryList: Array<TDSSafeAny> = [];
  trackingList: Array<TDSSafeAny> = [];
  producerList: Array<ProductUOMTypeDto> = [];
  importerList: Array<ProductUOMTypeDto> = [];
  distributorList: Array<ProductUOMTypeDto> = [];
  originCountryList: Array<OriginCountryDto> = [];
  lstAttributeLine: Array<AttributeLineDto> = [];
  lstUOM: Array<ProductUOMLineDto> = [];
  lstVariants: Array<ProductVariantDto> = [];
  lstProductCombo: Array<ProductComboDto> = [];
  stockChangeProductList: Array<StockChangeProductQtyDTO> = [];
  saleConfig!: SaleSettingConfigDto_V2;
  dataModel!: ProductTemplateDto;
  initInventory:number = 0;
  isLoading = false;
  isLoadingVariant = false;
  isLoadingAttribute = false;
  id: TDSSafeAny;
  minIndex = 0;

  pageSize = 20;
  pageIndex = 1;
  count: number = 1;
  indexPush: number = -1;

  companyCurrents!: CompanyCurrentDTO;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };
 
  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private readonly tdsConfigService: TDSConfigService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: TDSDestroyService,
    private createFormProductHandler : CreateFormProductHandler,
    private productCategoryService: ProductCategoryService,
    private productTemplateService: ProductTemplateService,
    private stockChangeProductQtyService: StockChangeProductQtyService,
    private productTemplateUOMLine: ProductTemplateUOMLineService,
    private productIndexDBService: ProductIndexDBService,
    private sharedService: SharedService,
    private productService: ProductService,
    private productTemplateFacade: ProductTemplateFacade) {
    this.createForm();
  }

  createForm() {
    this._form = this.createFormProductHandler.createForm(this._form, this.fb);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.loadData(this.id);
      this.loadProductAttributeLine(this.id);
      this.loadProductUOMLine(this.id);
      this.loadComboProducts(this.id);
    } else {
      this.loadDefault();
    }

    this.loadSaleConfig();
    this.loadProductTypeList();
    this.loadProductCategory();
    this.loadProductUOM();
    this.loadUOMs();
    this.loadPOSCategory();
    this.loadTrackingList();
    this.loadUOMAddType();
    this.loadOriginCountry();
    this.onEventEmitter();
    this.loadCurrentCompany();

    this.tdsConfigService.set('message', {
      maxStack: 3
    });
  }
  //#endregion Initialization

  onEventEmitter() {
    this.productTemplateFacade.onStockChangeProductQty$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {
        let warehouseId = this.companyCurrents?.DefaultWarehouseId;

        if(warehouseId > 0) {
            this.productService.lstInventory = null;
            this.loadInventoryWarehouseId(warehouseId);
            this.isLoading = false;
            this.router.navigateByUrl('/configs/products');
        }
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  loadSaleConfig() {
    this.sharedService.setSaleConfig();
    this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleConfig = {...res} as SaleSettingConfigDto_V2;
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Không thể tải cấu hình');
      }
    })
  }

  loadInventoryWarehouseId(warehouseId: number){
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe();
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res || {};
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  //#region Api-request
  loadData(id: TDSSafeAny) {
    this.isLoading = true;

    this.productTemplateService.getProductTemplateById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.dataModel = { ...res };

        // TODO: lấy danh sách biến thể
        if(TDSHelperArray.hasListValue(this.dataModel.ProductVariants)){
          this.lstVariants = this.dataModel.ProductVariants;
        }

        if(this.dataModel.OrderTag) {
          this.dataModel.OrderTag = this.dataModel.OrderTag.split(',');
        }

        this.formatProperty(this.dataModel);

        // nếu type = 'product' thì lấy thông tin số lượng thực tế của sản phẩm
        if(this.dataModel?.Type == 'product'){
          this.loadStockChangeProductQty(this.id);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || Message.CanNotLoadData);
      }
    })
  }

  loadDefault() {
    this.isLoading = true;

    this.productTemplateService.getDefault().pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          delete res['@odata.context'];
          this.dataModel = { ...res };

          this.formatProperty(res);
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      })
  }

  loadStockChangeProductQty(id: TDSSafeAny){
    let data = {
      model: {
        ProductTmplId: Number(id)
      }
    };

    this.stockChangeProductQtyService.getStockChangeProductQty(data).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.stockChangeProductList = [...res.value];
          // TODO: số lượng tồn thực tế
          this.stockChangeProductList.forEach(item => {
            this.initInventory += item.NewQuantity;
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.ComboProduct.CanNotLoadData);
        }
      })
  }

  loadComboProducts(id: TDSSafeAny){
    // TODO: lấy danh sách combo
    this.productTemplateService.getComboProducts(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {

          this.lstProductCombo = res.value.map((item) => {
            return {
              Product: item.Product,
              ProductId: item.ProductId,
              Quantity: item.Quantity
            }
          });
        },
        error: err => {
          this.message.error(err?.error?.message || Message.ComboProduct.CanNotLoadData);
        }
      })
  }

  loadProductTypeList() {
    this.productTypeList = [
      { value: 'product', text: 'Có thể lưu trữ' },
      { value: 'consu', text: 'Có thể tiêu thụ' },
      { value: 'service', text: 'Dịch vụ' }
    ];
  }

  loadProductCategory() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.categoryList = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    );
  }

  loadProductUOM() {
    this.productTemplateService.getProductUOM().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.UOMPOList = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    );
  }

  loadUOMs() {
    this.productTemplateUOMLine.getOUMs().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.UOMList = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    );
  }

  loadPOSCategory() {
    this.productTemplateService.getPOSCategory().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.POSCategoryList = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    );
  }

  loadTrackingList() {
    this.trackingList = [
      { value: 'lot', text: 'Theo lô' },
      { value: 'none', text: 'Không theo dõi' },
    ];
  }

  loadOriginCountry() {
    this.productTemplateService.getOriginCountry().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.originCountryList = [...res.value];
        },
        error: err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      }
    )
  }

  loadUOMAddType() {
    this.productTemplateService.getUOMAddType().subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.producerList = res.value.filter((x: { Type: string; }) => x.Type === 'producer');
          this.importerList = res.value.filter((x: { Type: string; }) => x.Type === 'importer');
          this.distributorList = res.value.filter((x: { Type: string; }) => x.Type === 'distributor');
        }
      }
    );
  }

  loadProductAttributeLine(id: TDSSafeAny) {
    this.productTemplateService.getProductAttributeLine(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.lstAttributeLine = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);

        }
      }
    )
  }

  loadProductUOMLine(id: TDSSafeAny) {
    this.productTemplateService.getProductUOMLine(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.lstUOM = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    )
  }
  
  formatProperty(data: ProductTemplateDto) {
    //TODO: xử lý array form
    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.forEach((x: WallPicturesDTO) => {
        this.addImages(x);
      });
    }

    if (TDSHelperArray.hasListValue(data.ProductVariants)) {
      data.ProductVariants.forEach((x: ProductVariantDto) => {
        this.addProductVariants(x);
      });
    }

    if (data.DateCreated) {
      data.DateCreated = new Date(data.DateCreated);
    }
    // TODO: chuyển đổi KL từ kg sang g
    data.Weight = data.Weight*1000;
    this._form.patchValue(data);
  }

  loadDataIndexDBCache() {
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({})
  }

  changeInitInventory(value: number){
    this._form.controls["InitInventory"].setValue(value);
  }

  getAvatar(url: string) {
    this._form.controls["ImageUrl"].setValue(url);
  }

  getBase64(base64: TDSSafeAny) {
    this._form.controls["Image"].setValue(base64);
  }

  getImageList(images: any) {
    if (TDSHelperArray.isArray(images.files)) {
      let lstImages = images.files as WallPicturesDTO[];
      this._form.controls["Images"] = this.fb.array([]);

      if (TDSHelperArray.hasListValue(lstImages)) {
        lstImages.forEach((x: WallPicturesDTO) => {
          this.addImages(x);
        });
      }
    }
  }

  initImages(data: WallPicturesDTO | null) {
    if (data != null) {
      return this.fb.group({
        MineType: [null],
        Name: [data.name],
        ResModel: ['product.template'],
        Type: ['url'],
        Url: [data.url]
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

  initProductVariants(data: ProductVariantDto | null) {
    if (data != null) {
      return this.fb.group(data)
    } else {
      return this.fb.group([null])
    }
  }

  addImages(data: WallPicturesDTO) {
    let control = <FormArray>this._form.controls['Images'];
    control.push(this.initImages(data));
  }

  addProductVariants(data: ProductVariantDto) {
    let control = <FormArray>this._form.controls['ProductVariants'];
    control.push(this.initProductVariants(data));
  }

  removeVariants(data: ProductVariantDto) {
    if (this.lstVariants.length > 1) {
      let variants = this.lstVariants.filter(f => f.NameGet != data.NameGet || f.Id != data.Id);
      this.lstVariants = [...variants];
    } else {
      this.message.error('Sản phẩm phải tồn tại ít nhất một biến thể');
    }
  }

  removeComboProduct(index: number) {
    this.lstProductCombo = this.lstProductCombo.filter((f,i)=> i != index);
  }

  removeUOM(index: number){
    this.lstUOM = [...this.lstUOM.filter((x, i) => i != index)];
  }

  addProduct() {
    let model = this.prepareModel();
    if(!model?.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    this.productTemplateService.insertProductTemplate(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TDSSafeAny) => {
          this.message.success(Message.InsertSuccess);
          this.loadDataIndexDBCache();

          let id = res.Id;
          let mapping = this.lstVariants?.map(v => v.QtyAvailable) as any[];
          this.productTemplateFacade.stockChangeProductQty(id, mapping, '');

        },
        error: err => {
          this.message.error(err?.error?.errors?.model[0] || Message.InsertFail);
          this.isLoading = false;
        }
    });
  }

  editProduct() {
    let model = this.prepareModel();
    if(!model?.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    this.productTemplateService.updateProductTemplate(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TDSSafeAny) => {
          this.message.success(Message.UpdatedSuccess);
          this.loadDataIndexDBCache();
          this.isLoading = false;

          this.router.navigateByUrl('/configs/products');
        },
        error: err => {
          this.message.error(err?.error?.message || Message.UpdatedFail);
          this.isLoading = false;
        }
    });
  }

  prepareModel() {
    return AddProductHandler.prepareModel(this.dataModel, this._form.value, this._form.controls["Images"].value, this.lstAttributeLine, this.lstVariants, this.lstProductCombo, this.lstUOM);
  }

  backToMain() {
    this.router.navigateByUrl('/configs/products');
  }

  onSave() {
    if (!TDSHelperString.hasValueString(this.dataModel.Name || this._form.controls["Name"].value)) {
      this.message.error('Vui lòng nhập tên');
      return
    }

    if (!TDSHelperObject.hasValue(this.dataModel.UOM || this._form.controls["UOM"].value)) {
      this.message.error('Vui lòng nhập đơn vị mặc định');
      return
    }

    if (!TDSHelperObject.hasValue(this.dataModel.UOMPO || this._form.controls["UOMPO"].value)) {
      this.message.error('Vui lòng nhập đơn vị mua');
      return
    }

    this.isLoading = true;

    if (this.id) {
      this.editProduct();
    } else {
      this.addProduct();
    }
  }
  //#endregion Handle

  //#region Modal
  showUpdateInitInventoryModal(){
    const modal = this.modalService.create({
      title: 'Cập nhật số lượng thực tế',
      content: UpdateInitInventoryComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstData: this.stockChangeProductList
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result){
        if (this.id) {
          this.loadData(this.id);
        }
      }
    });
  }

  showCreateAttributeModal() {
    let productName = this._form.controls.Name.value;

    if (productName) {
      const modal = this.modalService.create({
        title: 'Quản lý thuộc tính',
        content: ConfigAddAttributeProductModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          lstAttributeLine: this.lstAttributeLine
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: Array<AttributeLineDto>) => {
        if (TDSHelperArray.hasListValue(result)) {
          this.lstAttributeLine = [...result];
          let model = this.prepareModel();
          model.AttributeLines = [...result];

          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res) => {
                this.lstVariants = [...res.value];
                this.lstVariants.map(attr => {
                  if (attr.Id == 0) {
                    this.minIndex -= 1;
                    attr.Id = this.minIndex;
                  }
                });
              },
              error: (err) => {
                this.message.error(err?.error?.message || Message.CanNotLoadData);
              }
            }
          )
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  showEditVariantsModal(data: ProductVariantDto) {
    let name = this._form.controls["Name"].value;
    if (name) {
      let model = this.prepareModel();

      const modal = this.modalService.create({
        title: 'Sửa biến thể sản phẩm',
        content: CreateVariantsModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          listType: this.productTypeList,
          lstAttributeLine: this.lstAttributeLine,//TODO: danh sách thuộc tính-giá trị đã được chọn
          lstProductDefault: model, //TODO: model param dùng để gọi API tạo biến thể
          lstProductVariant: data //TODO: model variants được chọn để chỉnh sửa
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: ProductVariantDto) => {
        if (TDSHelperObject.hasValue(result)) {
          
          let index = this.lstVariants.findIndex(x => x.Id == result.Id && x.UOMId == result.UOMId);
          if(index > -1) {
            this.lstVariants[index] = {...result};
          }
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  showCreateComboModal(data?: ProductComboDto, index?:number) {
    const modal = this.modalService.create({
      title: data ? 'Sửa thành phần' : 'Thêm thành phần',
      content: CreateComboModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.componentInstance?.getProductCombo$.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if(data){
        this.lstProductCombo[index || 0] = result;
      }else{
        this.lstProductCombo.push(result);
      }
    });
  }

  addCategory() {
    const modal = this.modalService.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: ProductCategoryDto) => {
      if(res) {
        this.categoryList = [...[res],...this.categoryList];
      }
    });
  }

  addProducer() {
    const modal = this.modalService.create({
      title: 'Thêm nhà sản xuất',
      content: CreateUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: 'producer'
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: ProductUOMTypeDto) => {
      if(res) {
        this.producerList = [...[res],...this.producerList];
      }
    });
  }

  addImporter() {
    const modal = this.modalService.create({
      title: 'Thêm nhà nhập khẩu',
      content: CreateUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: 'importer'
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: ProductUOMTypeDto) => {
      if(res) {
        this.importerList = [...[res],...this.importerList];
      }
    });
  }

  addDistributor() {
    const modal = this.modalService.create({
      title: 'Thêm nhà phân phối',
      content: CreateUOMModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: 'distributor'
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: ProductUOMTypeDto) => {
      if(res) {
        this.distributorList = [...[res],...this.distributorList];
      }
    });
  }

  addOriginCountry() {
    const modal = this.modalService.create({
      title: 'Thêm xuất xứ',
      content: CreateCountryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: OriginCountryDto) => {
      if(res) {
        this.originCountryList = [...[res],...this.originCountryList];
      }
    });
  }

  createUOMModal(){
    const modal = this.modalService.create({
      title: 'Thêm đơn vị tính',
      content: CreateUnitComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        lstUOM: this.UOMList
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res){
        res.Id = this.indexPush;
        this.indexPush--;
        this.lstUOM = [...this.lstUOM,...[res]];
      }
    });
  }

  editUOMModal(data: ProductUOMLineDto, index: number){
    const modal = this.modalService.create({
      title: 'Sửa đơn vị tính',
      content: CreateUnitComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        lstUOM: this.UOMList,
        Item: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res){
        this.lstUOM.map((x,i) => {
          if(i == index) {
            x.Barcode = res.Barcode;
            x.ListPrice = res.ListPrice;
            x.UOM = res.UOM;
            x.UOMId = res.UOMId;
          }
        })
      }
    });
  }
}
