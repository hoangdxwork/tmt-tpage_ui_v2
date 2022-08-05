import { ProductUOMDTO, ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductUOMService } from 'src/app/main-app/services/product-uom.service';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PrepareEditVariantHandler } from 'src/app/main-app/handler-v2/product-variant/prepare-edit-variant.handler';

@Component({
  selector: 'edit-product-variant',
  templateUrl: './edit-product-variant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditProductVariantComponent implements OnInit {

  @Input() id!: number;

  _form!: FormGroup;
  dataModel!: ProductDTO;
  lstProductCategory!: ProductCategoryDTO[];
  lstProductUOM!: ProductUOMDTO[];
  imageList: Array<TDSSafeAny> = [];
  imageModel: Array<TDSSafeAny> = [];
  isLoading: boolean = false;
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

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
    private productService: ProductService,
    private prepareEditVariantHandler: PrepareEditVariantHandler,
    private message: TDSMessageService,
    private productUOMService: ProductUOMService,
    private productCategoryService: ProductCategoryService,
    private cdRef: ChangeDetectorRef) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadData();
      this.loadUOM();
      this.loadProductCategory();
    }
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      PriceVariant: [0],
      IsAvailableOnTPage: [null],
      ImageUrl: [null],
      Categ: [null, Validators.required],
      UOM: [null, Validators.required],
      UOMPO: [null, Validators.required],
      Images: this.fb.array([])
    })
  }

  loadData() {
    this.isLoading = true;

    this.productService.getById(this.id).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
        delete res['@odata.context'];
        this.dataModel = res;
        this.cdRef.detectChanges();
        this.updateForm(res);
      }, error => {
        this.message.error(error.error.message || 'Load dữ liệu thất bại');
      })
  }

  loadProductCategory() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstProductCategory = [...res.value];
    }, error => {
      this.message.error(error.error.message || 'load dữ liệu nhóm sản phẩm thất bại');
    })
  }

  loadUOM() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstProductUOM = [...res.value];
    }, error => {
      this.message.error(error.error.message || 'Load dữ liệu thất bại');
    })
  }

  updateForm(data: TDSSafeAny) {

    this._form.controls['Categ'].setValue(data.Categ);
    this._form.controls['UOM'].setValue(data.UOM);
    this._form.controls['UOMPO'].setValue(data.UOMPO);
    this._form.patchValue(data);


    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.map((x: any) => {
        this.addImages(x);
      })
    }
  }

  onSubmit() {
    if (!this._form.invalid) {
      this.modal.destroy(this._form);
    }
  }

  cancel() {
    this.modal.destroy(null);
  }

  addImages(data: any) {
    let control = <FormArray>this._form.controls['Images'];
    control.push(this.initImages(data));
  }

  removeImage(index: number) {
    let control = <FormArray>this._form.controls['Images'];
    control.removeAt(index);
  }

  initImages(data: any | null) {
    if (data != null) {
      return this.fb.group({
        MineType: [data.MineType],
        Name: [data.Name],
        ResModel: ['product.product'],
        Type: ['url'],
        Url: [data.Url]
      });
    } else {
      return this.fb.group({
        MineType: [null],
        Name: [null],
        ResModel: ['product.product'],
        Type: ['url'],
        Url: [null]
      });
    }
  }

  onLoadImage(event: any) {
    this._form.controls['Images'] = this.fb.array([]);
    let datas: any[] = [];

    event?.files.forEach((x: any) => {
      let item = {
        MineType: null,
        Name: x.name,
        ResModel: 'product.product',
        Type: ['url'],
        Url: x.url
      };

      datas.push(item);
    });

    if (event.isArray == true) {
      datas.forEach(x => {
        this.addImages(x);
      });
    } else {
      this._form.controls['ImageUrl'].setValue(event.files[0].url);
    }
  }

  prepareModel() {
    let model = this.prepareEditVariantHandler.prepareModel(this.dataModel, this._form.value, this._form.controls['Images'].value) as ProductDTO;

    return model;
  }

  checkError(){
    let model = this.prepareModel();

    if (!model.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
    }

    if (!model.Categ) {
      this.message.error('Vui lòng nhập nhóm sản phẩm');
    }

    if (!model.UOM && !model.UOMPO) {
      this.message.error('Vui lòng nhập đơn vị');
    }

    return !model.Name || !model.Categ || (!model.UOM && !model.UOMPO);
  }

  onSave(): any {
    let model = this.prepareModel();

    if(this.checkError()){
      return;
    }

    this.productService.updateProduct(this.id, model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success('Cập nhật thành công!');
      this.mappingCacheDB();
      this.modal.destroy(true);
    }, error => {
      this.message.error(error?.error?.message || 'Thao tác thất bại');
    });
  }

  mappingCacheDB() {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).pipe(takeUntil(this.destroy$)).subscribe((obs: TDSSafeAny) => {
      if (TDSHelperString.hasValueString(obs)) {
        let cache = JSON.parse(obs['value']) as TDSSafeAny;
        let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;
        let indexDbVersion = cacheDB.cacheVersion;
        let indexDbProductCount = cacheDB.cacheCount;
        let indexDbStorage = cacheDB.cacheDbStorage;

        this.loadProductIndexDB(indexDbProductCount, indexDbVersion, indexDbStorage);
      }
    });
  }

  loadProductIndexDB(indexDbProductCount: number, indexDbVersion: number, indexDbStorage: DataPouchDBDTO[]) {
    this.productIndexDBService.getLastVersionV2(indexDbProductCount, indexDbVersion)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }))
      .subscribe((res: ProductPouchDBDTO) => {

        if (res.IsDelete === true) {
          (indexDbStorage as any) = [];
          indexDbStorage = res.Datas;
        } else {
          res.Datas.forEach((x: DataPouchDBDTO) => {
            indexDbStorage = indexDbStorage.filter(a => !(a.ProductTmplId == x.Id && a.UOMId == x.UOMId));
            indexDbStorage.push(x);
          });
        }

        let versions = indexDbStorage.map((x: any) => x.Version);
        let lastVersion = Math.max(...versions);
        let count = indexDbStorage.length;

        let objCached: KeyCacheIndexDBDTO = {
          cacheCount: count,
          cacheVersion: lastVersion,
          cacheDbStorage: indexDbStorage
        };

        let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
        this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
      }, error => {
        this.modal.destroy(true);
      })
  }
}
