import { ProductTemplateDto } from './../../../../dto/configs/product/config-product-default-v2.dto';
import { AttributeLineDto, ProductVariantDto } from './../../../../dto/configs/product/config-product-variant.dto';
import { InventoryChangeType } from './../../../../dto/product-pouchDB/product-pouchDB.dto';
import { TDSNotificationService } from 'tds-ui/notification';
import { AddProductHandler } from 'src/app/main-app/handler-v2/product/prepare-create-product.handler';
import { ProductIndexDBService } from '../../../../services/product-indexdb.service';
import { TpageAddUOMComponent } from '../../../../shared/tpage-add-uom/tpage-add-uom.component';
import { CreateVariantsModalComponent } from '../../../configs/components/create-variants-modal/create-variants-modal.component';
import { ConfigAddAttributeProductModalComponent } from '../../../configs/components/config-attribute-modal/config-attribute-modal.component';
import { TpageSearchUOMComponent } from '../../../../shared/tpage-search-uom/tpage-search-uom.component';
import { TpageAddCategoryComponent } from '../../../../shared/tpage-add-category/tpage-add-category.component';
import { ProductUOMService } from '../../../../services/product-uom.service';
import { ProductCategoryService } from '../../../../services/product-category.service';
import { ProductTemplateService } from '../../../../services/product-template.service';
import { SharedService } from '../../../../services/shared.service';
import { KeyCacheIndexDBDTO, SyncCreateProductTemplateDto, DataPouchDBDTO } from '../../../../dto/product-pouchDB/product-pouchDB.dto';
import { ConfigAttributeLine, ConfigProductVariant, ConfigProductDefaultDTO } from '../../../../dto/configs/product/config-product-default.dto';
import { ProductCategoryDTO } from '../../../../dto/product/product-category.dto';
import { ProductTemplateDTO, ProductUOMDTO } from '../../../../dto/product/product.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { mergeMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { map, takeUntil } from 'rxjs/operators';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSUploadChangeParam, TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { StockChangeProductQtyDto } from '@app/dto/product-template/stock-change-productqty.dto';
import { ProductTemplateFacade } from '@app/services/facades/product-template.facade';

@Component({
  selector: 'drawer-add-product',
  templateUrl: './drawer-add-product.component.html',
  providers: [TDSDestroyService]
})
export class DrawerAddProductComponent implements OnInit {
  @Input() lstOrderTags!: string[];
  _form!: FormGroup;
  defaultGet!: ProductTemplateDto;

  lstCategory!: Array<ProductCategoryDTO>;
  lstUOMCategory!: Array<ProductUOMDTO>;
  lstAttributeLine: Array<AttributeLineDto> = [];
  lstProductVariant: Array<ProductVariantDto> = [];
  productTypeList: Array<TDSSafeAny> = [];
  hasVariants: boolean = false;
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

  lstCheckOrderTags: string[] = [];

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private productTemplateFacade: ProductTemplateFacade,
    private productIndexDBService: ProductIndexDBService,
    private productTemplateService: ProductTemplateService,
    private productCategoryService: ProductCategoryService,
    private productUOMService: ProductUOMService,
    private destroy$: TDSDestroyService,
    private notificationService: TDSNotificationService) {
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
          this.cdRef.detectChanges();
      },
      error:(error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    });
  }

  loadCategory() {
    this.isLoading = true;
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
          this.lstCategory = [...res?.value];
          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error:(error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || Message.CanNotLoadData);
          this.cdRef.detectChanges();
      }
    });
  }

  loadUOMCateg() {
    this.isLoading = true;
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:res => {
          this.lstUOMCategory = [...res?.value];
          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
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
      InitInventory: [0],
      UOM: [null, Validators.required],
      UOMPO: [null, Validators.required],
      OrderTag: [null],
      ProductVariantCount: [0]
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
    const formModel = this._form.value as ProductTemplateDto;
    let ProductVariants = [...this.lstProductVariant];
    ProductVariants.map(x => {
      x.OrderTag = (TDSHelperArray.isArray(x.OrderTag) && TDSHelperArray.hasListValue(x.OrderTag)) ? x.OrderTag.join(',') : x.OrderTag
    });

    this.defaultGet["Name"] = formModel.Name;
    this.defaultGet["Type"] = formModel.Type;
    this.defaultGet["DefaultCode"] = formModel.DefaultCode;
    this.defaultGet["Barcode"] = formModel.Barcode;
    this.defaultGet["Categ"] = formModel.Categ;
    this.defaultGet["CategId"] = formModel.Categ.Id;
    this.defaultGet["Weight"] = formModel.Weight;
    this.defaultGet["InitInventory"] = formModel.InitInventory;
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
    this.defaultGet["ProductVariants"] = [...ProductVariants];
    this.defaultGet['ProductVariantCount'] = this.defaultGet["ProductVariants"].length;

    return this.defaultGet;
  }

  onSave(type?: string) {
    if(this.isLoading) return;

    if(type) {
      let lstCheck = this.checkOrderTags();
      if(TDSHelperArray.hasListValue(lstCheck)) {
        let mess = lstCheck.join(',');
        this.notificationService.warning(`Mã chốt đơn đã tồn tại`,
                  `<div class="flex flex-col ">
                      <span class="mb-1">Mã tồn tại: <span class="font-semibold"> ${mess}</span></span>
                  </div>`);
        return;
      };
    }

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

            const data: SyncCreateProductTemplateDto = {
              type: type,
              productTmpl: product as ProductTemplateV2DTO,
              cacheDbStorage: [...indexDB.cacheDbStorage]
            };

            // TODO: gọi cập nhật tồn kho
            let id = data.productTmpl.Id;
            let mapping = this.lstProductVariant?.map(v => v.QtyAvailable) as any[];
            let exist = model.InitInventory && Number(model.InitInventory) > 0 && this.checkMapping(mapping) && mapping && mapping.length > 0;
            if(exist) {
              mapping[0] = model.InitInventory;
            }

            this.productTemplateFacade.stockChangeProductQty(id, mapping, InventoryChangeType._DRAWER_ADD_PRODUCT);

            this.modalRef.destroy(data.type ? data : null);
            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
      })
  }

  checkMapping(mapping: any[]) {
    let result = false;
    mapping.map(x => {
      if(x == 0) {
        result = true;
      }
    })

    return result;
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  onCreateCategory() {
    const modal = this.modal.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if(result) {
        this.lstCategory = [...[result],...this.lstCategory];
      }
    });
  }

  onSearchUOM(type: string) {
    const modal = this.modal.create({
      title: 'Tìm kiếm đơn vị tính',
      content: TpageSearchUOMComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if(result) {
        if(type == 'UOM') {
          this._form.controls["UOM"].setValue(result.Name);
        }

        if(type == 'UOMPO') {
          this._form.controls["UOMPO"].setValue(result.Name);
        }
      }
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
          lstAttributeLine: this.lstAttributeLine
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: Array<AttributeLineDto>) => {
        if (result) {
          this.isLoading = true;
          this.lstAttributeLine = [...result];

          let model = this.prepareModel() as ProductTemplateDto;
          model.AttributeLines = [...result];

          this.productTemplateService.suggestVariants({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res) => {
              this.lstProductVariant = [...res.value];

              this.isLoading = false;
              this.cdRef.detectChanges();
            },
            error:(err) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || Message.CanNotLoadData);
              this.cdRef.detectChanges();
            }
          })
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  showEditVariantsModal(data: ProductVariantDto) {
    let name = this._form.controls["Name"].value;

    if(name) {
      let model = this.prepareModel() as ProductTemplateDto;
      // let suggestModel = AddProductHandler.prepareSuggestModel(model);

      const modal = this.modal.create({
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
          this.lstProductVariant.map((item, index) => {
            if (item.AttributeValues[0]?.Id == result.AttributeValues[0]?.Id) {
              this.lstProductVariant[index] = {...result};
            }
          });
        }
      });
    } else {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }
  }

  removeVariants(data: ProductVariantDto) {
    if (this.lstProductVariant.length > 1) {
      let variants = this.lstProductVariant.filter(f => f.NameGet != data.NameGet || f.Id != data.Id);
      this.lstProductVariant = [...variants];
    } else {
      this.message.error('Sản phẩm phải tồn tại ít nhất một biến thể');
    }
  }

  showCreateUOMModal() {
    const modal = this.modal.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if(result) {
        this.lstUOMCategory = [...[result],...this.lstUOMCategory];
      }
    });
  }

  changeTags(event:any,i:number){
    let strs = [...this.checkInputMatch(event)];

    this.lstProductVariant[i].OrderTag = strs.length > 0 ? [...strs] : null;
    this.lstProductVariant[i] = this.lstProductVariant[i];
    this.lstProductVariant = [...this.lstProductVariant];

    // this.lstVariants[i].Tags = TDSHelperArray.hasListValue(event) ? event.join(',') : null;

    this.lstCheckOrderTags = this.getOrderTagsVariants(this.lstProductVariant);
  }

  checkOrderTags() {
    let lstOrderTagsVariants: string[] = this.getOrderTagsVariants(this.lstProductVariant);
    let exist: string[] = [];

    if(!TDSHelperArray.hasListValue(this.lstOrderTags)) {
      return exist;
    }

    if(TDSHelperArray.hasListValue(lstOrderTagsVariants)) {
      lstOrderTagsVariants.map((x) => {
          let tag = this.lstOrderTags.filter(y => y.toLocaleLowerCase().trim() == x.toLocaleLowerCase().trim())[0];

          if(tag){
            exist = [...exist, tag];
          }
      })
    }

    return [...exist];
  }

  getOrderTagsVariants(data: ProductVariantDto[]) {
    let tagsVariants: string[] = [];

    let dataTags = data.filter(x => x.OrderTag);
    let getTags = dataTags.map(x => TDSHelperArray.isArray(x.OrderTag) ? x.OrderTag.join(','): x.OrderTag);
    let tags = getTags.join(',');

    if(TDSHelperString.hasValueString(tags)) {
      tagsVariants = tags.split(',');
    }

    return [...tagsVariants];
  }

  checkInputMatch(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs && strs.length == 0) {
      pop = datas[0];
    } else {
      pop = datas[strs.length - 1];
    }

    let match = pop?.match(/[~!@$%^&*(\\\/\-['`;=+\]),.?":{}|<>_]/g);//có thể thêm #
    let matchRex = match && match.length > 0;

    // TODO: check kí tự đặc biệt
    if(matchRex || (TDSHelperString.isString(pop) && !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim()))) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  getUrl(event: string, index: number) {
    this.lstProductVariant[index].ImageUrl = event;
  }

  getBase64(event: string, index: number) {
    this.lstProductVariant[index].Image = event;
  }

  onRemoveImage(event: any, index: number) {
    this.lstProductVariant[index].ImageUrl = '';
    delete this.lstProductVariant[index].Image;
  }
}
