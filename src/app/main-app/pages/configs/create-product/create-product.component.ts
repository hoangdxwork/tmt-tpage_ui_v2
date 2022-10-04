import { CreateUnitComponent } from './../components/create-unit/create-unit.component';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { UpdateInitInventoryComponent } from './../components/update-init-inventory/update-init-inventory.component';
import { StockChangeProductQtyDTO } from './../../../dto/product/stock-change-product-qty.dto';
import { StockChangeProductQtyService } from './../../../services/stock-change-product-qty.service';
import { ComboProductDTO } from './../../../dto/product/product-combo.dto';
import { CreateComboModalComponent } from './../components/create-combo-modal/create-combo-modal.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TpageAddCategoryComponent } from '../../../shared/tpage-add-category/tpage-add-category.component';
import { ProductCategoryService } from '../../../services/product-category.service';
import { WallPicturesDTO } from '../../../dto/attachment/wall-pictures.dto';
import { Message } from '../../../../lib/consts/message.const';
import { CreateVariantsModalComponent } from '../components/create-variants-modal/create-variants-modal.component';
import { ConfigCateg, ConfigUOMPO, ConfigUOM, ConfigAttributeLine, ConfigSuggestVariants, UOMLine } from '../../../dto/configs/product/config-product-default.dto';
import { ConfigUOMTypeDTO, ConfigOriginCountryDTO } from '../../../dto/configs/product/config-UOM-type.dto';
import { ConfigProductVariant } from '../../../dto/configs/product/config-product-default.dto';
import { ConfigAddAttributeProductModalComponent } from '../components/config-attribute-modal/config-attribute-modal.component';
import { ProductTemplateUOMLineService } from '../../../services/product-template-uom-line.service';
import { ProductTemplateService } from '../../../services/product-template.service';
import { CreateCountryModalComponent } from '../components/create-country-modal/create-country-modal.component';
import { CreateUOMModalComponent } from '../components/create-UOM-modal/create-UOM-modal.component';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConfigProductDefaultDTO } from 'src/app/main-app/dto/configs/product/config-product-default.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { CreateFormProductHandler } from 'src/app/main-app/handler-v2/product/create-form-product.handler';
import { AddProductHandler } from 'src/app/main-app/handler-v2/product/prepare-create-product.handler';

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
  categoryList: Array<ConfigCateg> = [];
  UOMPOList: Array<ConfigUOMPO> = [];
  UOMList: Array<ConfigUOM> = [];
  POSCategoryList: Array<TDSSafeAny> = [];
  trackingList: Array<TDSSafeAny> = [];
  producerList: Array<ConfigUOMTypeDTO> = [];
  importerList: Array<ConfigUOMTypeDTO> = [];
  distributorList: Array<ConfigUOMTypeDTO> = [];
  originCountryList: Array<ConfigOriginCountryDTO> = [];
  lstAttributes: Array<ConfigAttributeLine> = [];
  lstUOM: Array<UOMLine> = [];
  lstVariants: Array<ConfigProductVariant> = [];
  lstProductCombo: Array<ComboProductDTO> = [];
  stockChangeProductList: Array<StockChangeProductQtyDTO> = [];
  dataModel!: ConfigProductDefaultDTO;
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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: TDSDestroyService,
    private createFormProductHandler : CreateFormProductHandler,
    private productCategoryService: ProductCategoryService,
    private productTemplateService: ProductTemplateService,
    private stockChangeProductQtyService: StockChangeProductQtyService,
    private productTemplateUOMLine: ProductTemplateUOMLineService,
    private productIndexDBService: ProductIndexDBService) {
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

    this.loadProductTypeList();
    this.loadProductCategory();
    this.loadProductUOM();
    this.loadUOMs();
    this.loadPOSCategory();
    this.loadTrackingList();
    this.loadUOMAddType();
    this.loadOriginCountry();
  }

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

  loadDataIndexDBCache() {
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({})
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

  formatProperty(data: ConfigProductDefaultDTO) {
    //TODO: xử lý array form
    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.forEach((x: WallPicturesDTO) => {
        this.addImages(x);
      });
    }

    if (TDSHelperArray.hasListValue(data.ProductVariants)) {
      data.ProductVariants.forEach((x: ConfigProductVariant) => {
        this.addProductVariants(x);
      });
    }

    if (data.DateCreated) {
      data.DateCreated = new Date(data.DateCreated);
    }

    this._form.patchValue(data);
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
          this.lstAttributes = [...res.value];
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

    modal.afterClose.subscribe(result => {
      if (result){
        this._form.controls["InitInventory"].setValue(result);
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
          defaultModel: this.lstAttributes
        }
      });

      modal.afterClose.subscribe((result: Array<ConfigAttributeLine>) => {
        if (TDSHelperArray.hasListValue(result)) {
          this.lstAttributes = result;
          let model = <ConfigSuggestVariants><unknown>this.prepareModel();
          model.AttributeLines = result;

          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe(
            {
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

  showEditVariantsModal(data: ConfigProductVariant) {
    let name = this._form.controls["Name"].value;

    if (name) {
      let suggestModel = <ConfigSuggestVariants><unknown>this.prepareModel();

      const modal = this.modalService.create({
        title: 'Sửa biến thể sản phẩm',
        content: CreateVariantsModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          listType: this.productTypeList,
          attributeLines: this.lstAttributes,//TODO: danh sách thuộc tính-giá trị đã được chọn
          suggestModel: suggestModel, //TODO: model param dùng để gọi API tạo biến thể
          editModel: data //TODO: model variants được chọn để chỉnh sửa
        }
      });

      modal.afterClose.subscribe((result: ConfigProductVariant) => {
        if (TDSHelperObject.hasValue(result)) {
          this.lstVariants.map((item) => {
            if (item.Id == result.Id) {
              item = result;
            }
          });
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  removeVariants(data: ConfigProductVariant) {
    if (this.lstVariants.length > 1) {
      let variants = this.lstVariants.filter(f => f.NameGet != data.NameGet || f.Id != data.Id);
      this.lstVariants = [...variants];
    } else {
      this.message.error('Sản phẩm phải tồn tại ít nhất một biến thể');
    }
  }

  showCreateComboModal(data?: ComboProductDTO, index?:number){
    const modal = this.modalService.create({
      title: data ? 'Sửa thành phần' : 'Thêm thành phần',
      content: CreateComboModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.componentInstance?.getProductCombo$.subscribe(result => {
      if(data){
        this.lstProductCombo[index || 0] = result;
      }else{
        this.lstProductCombo.push(result);
      }
    });
  }

  removeComboProduct(index: number) {
    this.lstProductCombo = this.lstProductCombo.filter((f,i)=> i != index);
  }

  addCategory() {
    const modal = this.modalService.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe(result => {
      this.loadProductCategory();
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

    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
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

    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
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

    modal.afterClose.subscribe(result => {
      this.loadUOMAddType();
    });
  }

  addOriginCountry() {
    const modal = this.modalService.create({
      title: 'Thêm xuất xứ',
      content: CreateCountryModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe(result => {
      this.loadOriginCountry();
    });
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

  initProductVariants(data: ConfigProductVariant | null) {
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

  editUOMModal(data: UOMLine, index: number){
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

  removeUOM(index: number){
    this.lstUOM = [...this.lstUOM.filter((x, i) => i != index)];
  }

  addProductVariants(data: ConfigProductVariant) {
    let control = <FormArray>this._form.controls['ProductVariants'];
    control.push(this.initProductVariants(data));
  }

  addProduct() {
    let model = this.prepareModel();
    if (model.Name) {
      this.productTemplateService.insertProductTemplate(model).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (res: TDSSafeAny) => {
              this.message.success(Message.InsertSuccess);
              this.loadDataIndexDBCache();
              this.isLoading = false;

              this.router.navigateByUrl('/configs/products');
            },
            error: err => {
              this.message.error(err?.error?.errors?.model[0] || Message.InsertFail);
              this.isLoading = false;
            }
          }
        );
    }
  }

  editProduct() {
    let model = this.prepareModel();

    if (model.Name) {
      this.productTemplateService.updateProductTemplate(model)
        .pipe(takeUntil(this.destroy$)).subscribe(
          {
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
          }
        );
    }
  }

  prepareModel() {
    return AddProductHandler.prepareModel(this.dataModel, this._form.value, this._form.controls["Images"].value, this.lstAttributes, this.lstVariants, this.lstProductCombo, this.lstUOM);
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
      if (this.dataModel) {
        this.addProduct();
      } else {
        this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (res: TDSSafeAny) => {
              delete res['@odata.context'];
              this.dataModel = { ...res };
              this.addProduct();
            },
            error: err => {
              this.message.error(err?.error?.message || Message.CanNotLoadData);
            }
          });
      }
    }
  }


}
