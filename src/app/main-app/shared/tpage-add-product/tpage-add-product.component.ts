import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { TDSSafeAny, TDSModalRef, TDSMessageService, TDSModalService, TDSUploadChangeParam, TDSUploadXHRArgs, TDSHelperObject, TDSUploadFile, TDSHelperString, TDSHelperArray } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewContainerRef, NgZone, OnDestroy } from '@angular/core';
import { ProductTemplateDTO, ProductType, ProductUOMDTO } from '../../dto/product/product.dto';
import { ProductTemplateService } from '../../services/product-template.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { TpageAddCategoryComponent } from '../tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from '../tpage-search-uom/tpage-search-uom.component';
import { CommonService } from '../../services/common.service';
import { TCommonService, TAPIDTO, TApiMethodType, THelperCacheService } from 'src/app/lib';
import { SharedService } from '../../services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';

@Component({
  selector: 'tpage-add-product',
  templateUrl: './tpage-add-product.component.html',
  styleUrls: ['./tpage-add-product.component.scss']
})
export class TpageAddProductComponent implements OnInit, OnDestroy {

  @Output() onLoadedProductSelect = new EventEmitter<TDSSafeAny>();

  formAddProduct!: FormGroup;
  defaultGet!: ProductTemplateDTO;

  lstCategory!: Array<ProductCategoryDTO>;
  lstUOMCategory!: Array<ProductUOMDTO>;

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];

  imageUrl = "https://randomuser.me/api/portraits/women/68.jpg";
  public readonly lstProductType = ProductType;
  fileList: TDSUploadFile[] = [];
  private destroy$ = new Subject();

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private productTemplateService: ProductTemplateService,
    private productCategoryService: ProductCategoryService,
    private productUOMService: ProductUOMService,
    private cacheApi: THelperCacheService,
    private productIndexDBService: ProductIndexDBService,
    public zone: NgZone) {
  }

  ngOnInit(): void {
    this.createForm();
    this.loadIndexDB();

    this.loadCategory();
    this.loadUOMCateg();
    this.loadDefault();

  }

  loadIndexDB() {
    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

      if(TDSHelperString.hasValueString(obs)) {
          let cache = JSON.parse(obs['value']) as TDSSafeAny;
          let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

          this.indexDbVersion = cacheDB.cacheVersion;
          this.indexDbProductCount = cacheDB.cacheCount;
          this.indexDbStorage = cacheDB.cacheDbStorage;
      }

    });
  }

  loadDefault() {
    this.productTemplateService.getDefault().pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      delete res["@odata.context"];

      this.defaultGet = res;
      this.updateForm(res);
    });
  }

  loadCategory() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCategory = res.value;
    });
  }

  loadUOMCateg() {
    this.productUOMService.getUOMCateg().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstUOMCategory = res.value;
    });
  }

  onSave(type?: string) {
    let model = this.prepareModel();
    this.productTemplateService.insert(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        delete res['@odata.context'];

        this.message.success(Message.Product.InsertSuccess);

        if (type == "select") {
          this.onLoadedProductSelect.emit(res);
          this.onCancel(null);
        }
        else {
          this.onCancel(null);
        }

        // Update Index DB
        this.pusToIndexDb();

      }, error => {
        this.message.error(`${error.error.message}`);
      });
  }

  pusToIndexDb(): any {
    this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
  }

  loadProductIndexDB(productCount: number, version: number): any {
    this.productIndexDBService.getLastVersionV2(productCount, version).pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductPouchDBDTO) => {

        if(TDSHelperArray.hasListValue(data.Datas)) {
          if(productCount == -1 && version == 0) {
              this.indexDbStorage = data.Datas;
          } else {
            if(TDSHelperArray.hasListValue(data.Datas)) {
              data.Datas.forEach((x: DataPouchDBDTO) => {
                  this.indexDbStorage.push(x);
              });
            }
          }
        }

        //TODO: check số version
        let versions = this.indexDbStorage.map((x: DataPouchDBDTO) => x.Version);
        let lastVersion = Math.max(...versions);

        //TODO: check số lượng
        let count = this.indexDbStorage.length;

        if(lastVersion != this.indexDbVersion || count != this.indexDbProductCount) {
            this.indexDbVersion = lastVersion;
            this.indexDbProductCount = count;
        }

        this.mappingCacheDB();
    }, error => {
        this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
    })
  }

  mappingCacheDB() {
    //TODO: lưu cache cho ds sản phẩm
    let objCached: KeyCacheIndexDBDTO = {
        cacheCount: this.indexDbProductCount,
        cacheVersion: this.indexDbVersion,
        cacheDbStorage: this.indexDbStorage
    };

    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onAddCateg() {
    const modal = this.modal.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });

    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadCategory();
      }
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
      if (TDSHelperObject.hasValue(result)) {
        this.loadUOMCateg();
      }
    });
  }

  handleChangeImage(info: TDSUploadChangeParam) {
    console.log(info);
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
        this.formAddProduct.controls["ImageUrl"].setValue(res[0].urlImageProxy);
    }, error => {
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
    });
  }

  prepareModel() {
    const formModel = this.formAddProduct.value;

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

  updateForm(data: ProductTemplateDTO) {
    let formControls = this.formAddProduct.controls;

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

  createForm() {
    this.formAddProduct = this.fb.group({
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
      UOMPO: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
