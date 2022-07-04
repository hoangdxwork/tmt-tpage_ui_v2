import { WallPicturesDTO } from './../../../dto/attachment/wall-pictures.dto';
import { Message } from './../../../../lib/consts/message.const';
import { CreateVariantsModalComponent } from '../components/create-variants-modal/create-variants-modal.component';
import { ConfigCateg, ConfigUOMPO, ConfigUOM, ConfigAttributeLine, ConfigSuggestVariants } from './../../../dto/configs/product/config-product-default.dto';
import { ConfigUOMTypeDTO, ConfigOriginCountryDTO } from './../../../dto/configs/product/config-UOM-type.dto';
import { ConfigProductVariant } from '../../../dto/configs/product/config-product-default.dto';
import { ConfigAddAttributeProductModalComponent } from './../components/config-add-attribute-product-modal/config-add-attribute-product-modal.component';
import { ConfigAddCategoryModalComponent } from './../components/config-add-category-modal/config-add-category-modal.component';
import { ProductTemplateOUMLineService } from './../../../services/product-template-uom-line.service';
import { ProductTemplateService } from './../../../services/product-template.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ConfigAddOriginCountryModalComponent } from '../components/config-add-origin-country-modal/config-add-origin-country-modal.component';
import { ConfigAddUOMModalComponent } from '../components/config-add-UOM-modal/config-add-UOM-modal.component';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConfigProductDefaultDTO } from 'src/app/main-app/dto/configs/product/config-product-default.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { AddProductHandler } from './add-product.handler';

@Component({
  selector: 'app-config-add-product',
  templateUrl: './config-add-product.component.html'
})
export class ConfigAddProductComponent implements OnInit, OnDestroy {
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
  lstVariants: Array<ConfigProductVariant> = [];
  dataModel!: ConfigProductDefaultDTO;
  isLoading = false;
  isLoadingVariant = false;
  isLoadingAttribute = false;
  id: TDSSafeAny;

  numberWithCommas = (value: TDSSafeAny) => {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };
  parserComas = (value: TDSSafeAny) => {
    if (value != null) {
      return TDSHelperString.replaceAll(value, ',', '');
    }
    return value
  };

  private destroy$ = new Subject<void>();

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productTemplateService: ProductTemplateService,
    private productTemplateOUMLine: ProductTemplateOUMLineService) {
    this.createForm();
  }

  createForm() {
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
      IsCombo: [false],
      ListPrice: [null],
      Name: [null, Validators.required],
      OriginCountry: [null],
      POSCateg: [null],//TODO: nhóm pos
      Producer: [null],
      ProductVariants: this.fb.array([]),
      PurchaseOK: [true],
      SaleOK: [true],
      Specifications: [null],
      StandardPrice: [null],
      Tracking: ['none'],
      Type: ['product'],
      UOM: [null, Validators.required],
      UOMPO: [null, Validators.required],
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
  }

  loadData(id: TDSSafeAny) {
    this.isLoading = true;

    this.productTemplateService.getProductTemplateById(id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe((res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.dataModel = { ...res };
        
        this.formatProperty(this.dataModel);
      }, error => {
        this.message.error(error?.error?.message || Message.CanNotLoadData);
      })
  }

  loadDefault() {
    this.isLoading = true;
    this.productTemplateService.getDefault().pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe((res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.dataModel = { ...res };
        this.formatProperty(res);
      }, error => {
        this.message.error(error?.error?.message || Message.CanNotLoadData);
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
      this.lstVariants = data.ProductVariants;
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
    this.productService.getProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        this.categoryList = [...res.value];
      }, error => {
        this.message.error(Message.CanNotLoadData);
      }
    );
  }

  loadProductUOM() {
    this.productTemplateService.getProductUOM().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        this.UOMPOList = [...res.value];
      },
      error => {
        this.message.error(Message.CanNotLoadData);
      }
    );
  }

  loadUOMs() {
    this.productTemplateOUMLine.getOUMs().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        this.UOMList = [...res.value];
      },
      err => {
        this.message.error(Message.CanNotLoadData);
      }
    );
  }

  loadPOSCategory() {
    this.productTemplateService.getPOSCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        this.POSCategoryList = [...res.value];
      },
      err => {
        this.message.error(Message.CanNotLoadData);
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
      (res: TDSSafeAny) => {
        this.originCountryList = [...res.value];
      },
      err => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
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

  showCreateAttributeModal() {
    let productName = this._form.controls.Name.value;
    if (productName) {
      const modal = this.modalService.create({
        title: 'Quản lý thuộc tính',
        content: ConfigAddAttributeProductModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
      });

      modal.afterClose.subscribe((result: Array<ConfigAttributeLine>) => {
        if (TDSHelperObject.hasValue(result)) {
          this.lstAttributes = result;
          let model = <ConfigSuggestVariants><unknown>this.prepareModel();
          model.AttributeLines = result;
          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe(
            (res) => {
              this.lstVariants = res.value;
              this.dataModel.ProductVariants = this.lstVariants;
            },
            (err) => {
              this.message.error(err?.error?.message || Message.CanNotLoadData);
            }
          )
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  showCreateVariantsModal() {
    if (this.lstAttributes?.length > 0) {
      let formModel = this._form.value;
      let suggestModel = <ConfigSuggestVariants><unknown>this.prepareModel();

      if (formModel.Name) {
        const modal = this.modalService.create({
          title: 'Thêm biến thể sản phẩm',
          content: CreateVariantsModalComponent,
          size: "lg",
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            attributeLines: this.lstAttributes,
            productTypeList: this.productTypeList,
            suggestModel: suggestModel,
            defaultModel: {
              Name: formModel.Name,
              Type: formModel.Type,
              DefaultCode: formModel.DefaultCode,
              Barcode: formModel.Barcode
            }
          }
        });

        modal.afterClose.subscribe((result: ConfigProductVariant) => {
          if (TDSHelperObject.hasValue(result)) {
            this.lstVariants.push(result);
            this.lstVariants = [...this.lstVariants];
          }
        });
      } else {
        this.message.error('Vui lòng nhập tên sản phẩm');
      }
    }
  }

  showEditVariantsModal(data: ConfigProductVariant) {
    if (this.lstAttributes?.length > 0) {
      let formModel = this._form.value;
      let suggestModel = <ConfigSuggestVariants><unknown>this.prepareModel();

      if (formModel.Name) {
        const modal = this.modalService.create({
          title: 'Sửa biến thể sản phẩm',
          content: CreateVariantsModalComponent,
          size: "lg",
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            attributeLines: this.lstAttributes,
            productTypeList: this.productTypeList,
            suggestModel: suggestModel,
            editModel: data
          }
        });

        modal.afterClose.subscribe((result: ConfigProductVariant) => {
          if (TDSHelperObject.hasValue(result)) {
            this.lstVariants.forEach((item, i) => {
              //TODO: do Id luôn = 0 nên không thể xét theo Id
              if (item.NameGet == result.NameGet && item.PriceVariant == result.PriceVariant) {
                this.lstVariants[i] = result;
              }
            })
            this.lstVariants = [...this.lstVariants];
          }
        });
      } else {
        this.message.error('Vui lòng nhập tên sản phẩm');
      }
    }
  }

  removeVariants(data: ConfigProductVariant) {
    let variants = this.lstVariants.filter(f => f.NameGet != data.NameGet && f.PriceVariant != data.PriceVariant);
    this.lstVariants = [...variants];
  }

  addCategory() {
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

  addProducer() {
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

  addImporter() {
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

  addDistributor() {
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

  addOriginCountry() {
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

  getAvatar(url: string) {
    this._form.controls.ImageUrl.setValue(url);
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

  addProductVariants(data: ConfigProductVariant) {
    let control = <FormArray>this._form.controls['ProductVariants'];
    control.push(this.initProductVariants(data));
  }

  addProduct() {
    let model = this.prepareModel();

    if (model.Name) {
      this.productTemplateService.insertProductTemplate(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res: TDSSafeAny) => {
          this.message.success('Thêm mới thành công');
          this.router.navigateByUrl('/configs/products');
        },
        err => {
          this.message.error(err?.error?.errors?.model[0] || Message.InsertFail);
        }
      );
    }
  }

  editProduct() {
    let model = this.prepareModel();

    if (model.Name) {
      this.productTemplateService.updateProductTemplate(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res: TDSSafeAny) => {
          this.message.success(Message.UpdatedSuccess);
          this.router.navigateByUrl('/configs/products');
        },
        err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      );
    }
  }

  prepareModel() {
    let images = this._form.controls["Images"].value as WallPicturesDTO[];

    AddProductHandler.prepareModel(this.dataModel, this._form.value, images);
    return this.dataModel;
  }

  backToMain() {
    this.router.navigateByUrl('/configs/products');
  }

  onSubmit() {
    let model = this.prepareModel();

    if (!TDSHelperString.hasValueString(model.Name)) {
      this.message.error('Vui lòng nhập tên');
      return
    }

    if (!TDSHelperObject.hasValue(model.UOM)) {
      this.message.error('Vui lòng nhập đơn vị mặc định');
      return
    }

    if (!TDSHelperObject.hasValue(model.UOMPO)) {
      this.message.error('Vui lòng nhập đơn vị mua');
      return
    }

    if (this.id) {
      this.editProduct();
    } else {
      if (this.dataModel) {
        this.addProduct();
      } else {
        this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          delete res['@odata.context'];
          this.dataModel = { ...res };
          this.addProduct();
        }, err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
