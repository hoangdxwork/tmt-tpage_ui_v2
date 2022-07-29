import { Subject, finalize } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewContainerRef, NgZone, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { ProductTemplateDTO, ProductType, ProductUOMDTO } from '../../dto/product/product.dto';
import { ProductTemplateService } from '../../services/product-template.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { TpageAddCategoryComponent } from '../tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from '../tpage-search-uom/tpage-search-uom.component';
import { SharedService } from '../../services/shared.service';
import { map, takeUntil, mergeMap } from 'rxjs/operators';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { KeyCacheIndexDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSUploadChangeParam, TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSNotificationService } from 'tds-ui/notification';
import { ConfigAddAttributeProductModalComponent } from '../../pages/configs/components/config-attribute-modal/config-attribute-modal.component';
import { ConfigAttributeLine, ConfigProductVariant, ConfigSuggestVariants } from '../../dto/configs/product/config-product-default.dto';
import { CreateVariantsModalComponent } from '../../pages/configs/components/create-variants-modal/create-variants-modal.component';
import { TpageAddUOMComponent } from '../tpage-add-uom/tpage-add-uom.component';

@Component({
  selector: 'tpage-add-product',
  templateUrl: './tpage-add-product.component.html'
})

export class TpageAddProductComponent implements OnInit, OnDestroy {

  @Output() onLoadedProductSelect = new EventEmitter<TDSSafeAny>();
  @Input() typeComponent!: any;

  _form!: FormGroup;
  defaultGet!: ProductTemplateDTO;

  lstCategory!: Array<ProductCategoryDTO>;
  lstUOMCategory!: Array<ProductUOMDTO>;
  lstAttributes: Array<ConfigAttributeLine> = [];
  lstVariants: Array<ConfigProductVariant> = [];
  productTypeList: Array<TDSSafeAny> = [];

  minIndex = 0;
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

  isLoading: boolean = false;
  public readonly lstProductType = ProductType;
  fileList: TDSUploadFile[] = [];

  private destroy$ = new Subject<void>();

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private productIndexDBService: ProductIndexDBService,
    private productTemplateService: ProductTemplateService,
    private productCategoryService: ProductCategoryService,
    private productUOMService: ProductUOMService,
    private notification: TDSNotificationService,
    public zone: NgZone) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCategory();
    this.loadUOMCateg();
    this.loadDefault();
  }

  loadDefault() {
    this.isLoading = true;

    this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: TDSSafeAny) => {
        delete res["@odata.context"];
        this.defaultGet = res;
        this.updateForm(res);

    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  loadCategory() { 
    this.isLoading = true;

    this.productCategoryService.get().pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
      this.lstCategory = [...res.value];
    },
    error=>{
      this.message.error(error?.error?.message || Message.CanNotLoadData);
    });
  }

  loadUOMCateg() {
    this.isLoading = true;

    this.productUOMService.get().pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
      this.lstUOMCategory = [...res.value];
    });
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      Type: [null],
      DefaultCode: [null],
      Barcode: [null],
      Categ: [null, Validators.required],
      Weight: [0],
      ListPrice: [0],
      DiscountSale: [0],
      PurchasePrice: [0],
      DiscountPurchase: [0],
      StandardPrice: [0],
      ImageUrl: [null],
      UOM: [null, Validators.required],
      UOMPO: [null, Validators.required],
      Tags: [null]
    });
  }

  updateForm(data: ProductTemplateDTO) {
    let formControls = this._form.controls;

    formControls["Type"].setValue(data.ShowType);
    formControls["Categ"].setValue(data.Categ);
    formControls["UOM"].setValue(data.UOM);
    formControls["UOMPO"].setValue(data.UOMPO);
    formControls["ImageUrl"].setValue(data.ImageUrl);

    formControls["Name"].setValue(data.Name);
    formControls["DefaultCode"].setValue(data.DefaultCode);
    formControls["Barcode"].setValue(data.Barcode);
    formControls["Weight"].setValue(data.Weight);
    formControls["ListPrice"].setValue(data.ListPrice);
    formControls["DiscountSale"].setValue(
      data.DiscountSale
    );
    formControls["PurchasePrice"].setValue(
      data.PurchasePrice
    );
    formControls["DiscountPurchase"].setValue(
      data.DiscountPurchase
    );
    formControls["StandardPrice"].setValue(
      data.StandardPrice
    );
  }

  prepareModel() {
    const formModel = this._form.value;

    this.defaultGet["Name"] = formModel.Name;
    this.defaultGet["Type"] = formModel.Type;
    this.defaultGet["DefaultCode"] = formModel.DefaultCode;
    this.defaultGet["Barcode"] = formModel.Barcode;
    this.defaultGet["Categ"] = formModel.Categ;
    this.defaultGet["CategId"] = formModel.Categ.Id;

    this.defaultGet["Weight"] = formModel.Weight;
    this.defaultGet["ListPrice"] = formModel.ListPrice;
    this.defaultGet["DiscountSale"] = formModel.DiscountSale;
    this.defaultGet["PurchasePrice"] = formModel.PurchasePrice;
    this.defaultGet["DiscountPurchase"] = formModel.DiscountPurchase;
    this.defaultGet["StandardPrice"] = formModel.StandardPrice;
    // this.defaultGet["Tags"] =  formModel.Tags;

    if (formModel.UOM) {
      this.defaultGet["UOM"] = formModel.UOM;
      this.defaultGet["UOMId"] = formModel.UOM.Id;
    }

    if (formModel.UOMPO) {
      this.defaultGet["UOMPO"] = formModel.UOMPO;
      this.defaultGet["UOMPOId"] = formModel.UOMPO.Id;
    }
    this.defaultGet["ImageUrl"] = formModel.ImageUrl;

    return this.defaultGet;
  }

  onSave(type?: string) :any {
    let model = this.prepareModel();
    this.isLoading = true;

    this.productTemplateService.insert(model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((res) => {

        delete res['@odata.context'];
        this.message.success('Thêm mới sản phẩm thành công');

        // TODO: Trường hợp ở component Phiếu bán hàng
        if(this.typeComponent == 'lst-product-tmp') {
            this.productIndexDBService.loadProductIndexDBV2().subscribe((x) => {
                if (type == "select") {
                    this.onCancel([res, x]);
                } else {
                    this.onCancel(null);
                }
            }, error => {
                if (type == "select") {
                    this.onCancel([res, null]);
                } else {
                    this.onCancel(null);
                }

                this.notification.warning(
                  'Đã xảy ra lỗi',
                  'Không thể cập nhật IndexDB ProductLastV2')
            })
        }

        else {
          if (type == "select") {
              this.onCancel([res, null]);
          } else {
              this.onCancel(null);
          }
          this.productIndexDBService.loadProductIndexDBV2().subscribe();
        }
      }, error => {
        this.message.error(`${error?.error?.message}`);
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onCreateCategory() {
    const modal = this.modal.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {}
    });

    modal.afterClose.subscribe(result => {
      this.loadCategory();
    });
  }

  onSearchUOM() {
    const modal = this.modal.create({
      title: 'Tìm kiếm đơn vị tính',
      content: TpageSearchUOMComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });

    modal.afterClose.subscribe(result => {
      this.loadUOMCateg();
    });
  }

  handleChangeImage(info: TDSUploadChangeParam) {
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} ${Message.Upload.Success}`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} ${Message.Upload.Failed}`);
    }
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: TDSUploadFile) {
    let formData: any = new FormData();
    formData.append("files", file as any, file.name);
    formData.append('id', '0000000000000051');

    return this.sharedService.saveImageV2(formData).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.message.success(Message.Upload.Success);
        this._form.controls["ImageUrl"].setValue(res[0].urlImageProxy);
        this.cdRef.markForCheck();
    }, error => {
      this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
    });
  }

  loadProductTypeList() {
    this.productTypeList = [
      { value: 'product', text: 'Có thể lưu trữ' },
      { value: 'consu', text: 'Có thể tiêu thụ' },
      { value: 'service', text: 'Dịch vụ' }
    ];
  }

  showCreateAttributeModal() {
    let productName = this._form.controls.Name.value;
    if (productName) {
      const modal = this.modal.create({
        title: 'Quản lý thuộc tính',
        content: ConfigAddAttributeProductModalComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          defaultModel: this.lstAttributes
        }
      });

      modal.afterClose.subscribe((result: Array<ConfigAttributeLine>) => {
        if (TDSHelperObject.hasValue(result)) {
          this.lstAttributes = result;
          let model = <ConfigSuggestVariants><unknown>this.prepareModel();
          model.AttributeLines = result;
          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe(
            (res) => {
              this.lstVariants = [...res.value];
              console.log(this.lstVariants )
              this.lstVariants.map(attr => {
                if (attr.Id == 0) {
                  this.minIndex -= 1;
                  attr.Id = this.minIndex;
                }
              });
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

  showEditVariantsModal(data: ConfigProductVariant) {
    let name = this._form.controls["Name"].value;

    if (name) {
      let suggestModel = <ConfigSuggestVariants><unknown>this.prepareModel();

      const modal = this.modal.create({
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

  onAddUOM() {
    const modal = this.modal.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        this.loadUOMCateg();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



