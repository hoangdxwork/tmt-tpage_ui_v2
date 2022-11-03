import { TDSDestroyService } from 'tds-ui/core/services';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from './../../dto/product-pouchDB/product-pouchDB.dto';
import { mergeMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';
import { ProductTemplateDTO, ProductType, ProductUOMDTO } from '../../dto/product/product.dto';
import { ProductTemplateService } from '../../services/product-template.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { TpageAddCategoryComponent } from '../tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from '../tpage-search-uom/tpage-search-uom.component';
import { SharedService } from '../../services/shared.service';
import { map, takeUntil } from 'rxjs/operators';
import { ProductIndexDBService } from '../../services/product-indexdb.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSUploadChangeParam, TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ConfigAddAttributeProductModalComponent } from '../../pages/configs/components/config-attribute-modal/config-attribute-modal.component';
import { ConfigAttributeLine, ConfigProductVariant, ConfigSuggestVariants } from '../../dto/configs/product/config-product-default.dto';
import { CreateVariantsModalComponent } from '../../pages/configs/components/create-variants-modal/create-variants-modal.component';
import { TpageAddUOMComponent } from '../tpage-add-uom/tpage-add-uom.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';

@Component({
  selector: 'modal-product-template',
  templateUrl: './modal-product-template.component.html',
  providers: [TDSDestroyService]
})

export class ModalProductTemplateComponent implements OnInit {

  @Output() onLoadedProductSelect = new EventEmitter<TDSSafeAny>();
  @Input() type!: string;

  _form!: FormGroup;
  defaultGet!: ProductTemplateDTO;

  lstCategory!: Array<ProductCategoryDTO>;
  lstUOMCategory!: Array<ProductUOMDTO>;
  lstAttributes: Array<ConfigAttributeLine> = [];
  lstVariants: Array<ConfigProductVariant> = [];
  productTypeList: Array<TDSSafeAny> = [];

  cacheObject!: KeyCacheIndexDBDTO;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  };

  parserComas = (value: TDSSafeAny) =>{
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  isLoading: boolean = false;
  lstProductType = [
    { value: 'product', text: 'Có thể lưu trữ'},
    { value: 'consu', text: 'Có thể tiêu thụ'},
    { value: 'service', text: 'Dịch vụ'}
  ];

  fileList: TDSUploadFile[] = [];

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
    private destroy$: TDSDestroyService) {
       this.createForm();
  }

  ngOnInit(): void {
    this.loadCategory();
    this.loadUOMCateg();
    this.loadDefault();
  }

  loadDefault() {
    this.isLoading = true;
    this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
          delete res["@odata.context"];
          this.defaultGet = res;

          this.updateForm(res);
          this.isLoading = false;
      },
      error:(error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  loadCategory() {
    this.isLoading = true;
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
          this.lstCategory = [...res?.value];
          this.isLoading = false;
      },
      error:(error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || Message.CanNotLoadData);
      }
    });
  }

  loadUOMCateg() {
    this.isLoading = true;
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:res => {
          this.lstUOMCategory = [...res?.value];
          this.isLoading = false;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
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
      OrderTag: [null]
    });
  }

  updateForm(data: ProductTemplateDTO) {
    let formControls = this._form.controls;

    formControls["Type"].setValue(data.Type);
    formControls["Categ"].setValue(data.Categ);
    formControls["UOM"].setValue(data.UOM);
    formControls["UOMPO"].setValue(data.UOMPO);
    formControls["ImageUrl"].setValue(data.ImageUrl);

    formControls["Name"].setValue(data.Name);
    formControls["DefaultCode"].setValue(data.DefaultCode);
    formControls["Barcode"].setValue(data.Barcode);
    formControls["Weight"].setValue(data.Weight);
    formControls["ListPrice"].setValue(data.ListPrice);
    formControls["DiscountSale"].setValue(data.DiscountSale);
    formControls["PurchasePrice"].setValue(data.PurchasePrice);
    formControls["DiscountPurchase"].setValue(data.DiscountPurchase);
    formControls["StandardPrice"].setValue(data.StandardPrice);
    formControls['OrderTag'].setValue(data.OrderTag);
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
    this.defaultGet["OrderTag"] = formModel.OrderTag ? formModel.OrderTag.toString(): null;

    if (formModel.UOM) {
      this.defaultGet["UOM"] = formModel.UOM;
      this.defaultGet["UOMId"] = formModel.UOM.Id;
    }

    if (formModel.UOMPO) {
      this.defaultGet["UOMPO"] = formModel.UOMPO;
      this.defaultGet["UOMPOId"] = formModel.UOMPO.Id;
    }

    this.defaultGet["ImageUrl"] = formModel.ImageUrl;
    this.defaultGet["ProductVariants"] = [...this.lstVariants];

    return this.defaultGet;
  }

  onSave(type?: string) {
    if(this.isLoading) return;
    let model = this.prepareModel();

    this.isLoading = true;
    this.productTemplateService.insert(model).pipe(
      map((product: any) => {
          delete product['@odata.context'];
          return product;
      }),
      mergeMap((product: any) => {
          this.productIndexDBService.setCacheDBRequest();
          return this.productIndexDBService.getCacheDBRequest().pipe(map((indexDB: any) => {
              return [product, indexDB];
          }))
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([product, indexDB]) => {

            // TODO: chỉ dùng cho chiến dịch live
            product._attributes_length = model.AttributeLines?.length;

            const data: SyncCreateProductTemplateDto = {
              type: type,
              productTmpl: product as ProductTemplateV2DTO,
              cacheDbStorage: [...indexDB.cacheDbStorage] as DataPouchDBDTO[]
            };

            this.modalRef.destroy(type ? data : null);
            this.isLoading = false;
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      })
  }

  onCancel() {
    this.modalRef.destroy(null);
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
      viewContainerRef: this.viewContainerRef
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

    return this.sharedService.saveImageV2(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.message.success(Message.Upload.Success);
        this._form.controls["ImageUrl"].setValue(res[0].urlImageProxy);
        this.cdRef.markForCheck();
      },
      error:(error) => {
        this.message.error(error?.Message || 'Upload xảy ra lỗi');
      }
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
          this.isLoading = true;
          this.lstAttributes = result;
          let model = <ConfigSuggestVariants><unknown>this.prepareModel();
          model.AttributeLines = result;

          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe(
            (res) => {
              this.lstVariants = [...res.value];
              this.isLoading = false;
            },
            (err) => {
              this.isLoading = false;
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
          this.lstVariants.map((item, index) => {
            if (item.AttributeValues[0]?.Id == result.AttributeValues[0]?.Id) {
              this.lstVariants[index] = {...result};
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

  changeTags(event:any,i:number){
    this.lstVariants[i].Tags = TDSHelperArray.hasListValue(event) ? event.join(',') : null;
  }
}
