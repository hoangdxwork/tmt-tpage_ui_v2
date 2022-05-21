import { ProductCategoryService } from '../../../../services/product-category.service';
import { ProductUOMService } from '../../../../services/product-uom.service';
import { ProductCategoryDTO } from '../../../../dto/product/product-category.dto';
import { ProductDTO, ProductUOMDTO } from '../../../../dto/product/product.dto';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ProductService } from '../../../../services/product.service';
import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny, TDSMessageService, TDSHelperString, TDSHelperArray } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';

@Component({
  selector: 'edit-product-variant',
  templateUrl: './edit-product-variant.component.html',
})

export class EditProductVariantComponent implements OnInit {

  @Input() id!: number;
  _form!: FormGroup;

  dataModel!: ProductDTO;
  lstProductCategory!: ProductCategoryDTO[];
  lstProductUOM!: ProductUOMDTO[];
  imageList: Array<TDSSafeAny> = [];
  imageListUpLoad: Array<TDSSafeAny> = [];
  imageModel: Array<TDSSafeAny> = [];
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
    private productService: ProductService,
    private message: TDSMessageService,
    private productUOMService : ProductUOMService,
    private productCategoryService: ProductCategoryService) {
      this.createForm();
  }

  ngOnInit(): void {
    if(this.id) {
      this.loadData();
      this.loadUOM();
      this.loadProductCategory();
    }
  }

  createForm(){
    this._form = this.fb.group({
      Name: [null, Validators.required],
      PriceVariant: [0],
      IsAvailableOnTPage: [null],
      ImageUrl: [null],
      CategId: [null],
      UOMId: [null],
      UOMPOId: [null],
      POSCategId: [null],
      Images: this.fb.array([])
    })
  }

  loadData() {
    this.isLoading = true;
    this.productService.getById(this.id).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
          delete res['@odata.context'];
          this.dataModel = res;
          this.updateForm(res);
    }, error => {
      this.message.error(error.error.message || 'Load dữ liệu thất bại!');
    })
  }

  loadProductCategory(){
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.lstProductCategory = [...res.value];
    }, error=>{
      this.message.error(error.error.message || 'load dữ liệu nhóm sản phẩm thất bại!')
    })
  }

  loadUOM(){
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
        this.lstProductUOM = [...res.value];
    }, error => {
        this.message.error(error.error.message || 'Load dữ liệu thất bại!!')
    })
  }

  updateForm(data: any){
    this._form.controls['Name'].setValue(data.Name);
    this._form.controls['ImageUrl'].setValue(data.ImageUrl);
    this._form.controls['PriceVariant'].setValue(data.PriceVariant);
    this._form.controls['IsAvailableOnTPage'].setValue(data.IsAvailableOnTPage);
    this._form.controls['CategId'].setValue(data.Categ.Id);
    this._form.controls['UOMId'].setValue(data.UOM.Id);
    this._form.controls['UOMPOId'].setValue(data.UOMPO.Id);
    this._form.controls['POSCategId'].setValue(data.POSCateg ? data.POSCateg.Id : null);
    if(TDSHelperArray.hasListValue(data.Images)){
      data.Images.map((x: any) => {
        this.initImages(x);
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
    if(data != null) {
      return this.fb.group({
          MineType: [data.MineType],
          Name: [data.Name],
          ResModel: [data.ResModel],
          Type: [data.Type],
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
    (event as any[]).map(x => {

    })
  }

  onSave(): any {
    let model = this.prepareModel();
    if (!model.Name) {
      return  this.message.error('Vui lòng nhập tên sản phẩm');
    }
    this.productService.updateProduct(this.id, model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success('Cập nhật thành công!');
      this.mappingCacheDB();
    }, error => {
      this.message.error('Thao tác thất bại!');
    });
  }

  mappingCacheDB() {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

      if(TDSHelperString.hasValueString(obs)) {
        let cache = JSON.parse(obs['value']) as TDSSafeAny;
        let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

        let indexDbVersion = cacheDB.cacheVersion;
        let indexDbProductCount = cacheDB.cacheCount;
        let indexDbStorage = cacheDB.cacheDbStorage;
        this.loadProductIndexDB(indexDbVersion, indexDbProductCount, indexDbStorage);
      }
    });
  }

  loadProductIndexDB(indexDbProductCount: number, indexDbVersion: number, indexDbStorage: DataPouchDBDTO[]) {
    this.productIndexDBService.getLastVersionV2(indexDbProductCount, indexDbVersion)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {this.isLoading = false }))
      .subscribe((res: ProductPouchDBDTO) => {

        if(res.IsDelete === true) {
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
        this.modal.destroy(true);
    }, error => {
        this.modal.destroy(true);
    })
  }

  prepareModel() {
    const model = this.dataModel;
    const formModel = this._form.value;

    model.Name = formModel.Name ? formModel.Name : model.Name;
    model.Categ = formModel.Categ ? formModel.Categ : model.Categ;
    model.CategId = formModel.CategId ? formModel.CategId : model.CategId;
    model.UOMId = formModel.UOMId ? formModel.UOMId : model.UOMId;
    model.PriceVariant = formModel.PriceVariant ? formModel.PriceVariant : model.PriceVariant
    model.UOMPOId = formModel.UOMPOId ? formModel.UOMPOId : model.UOMPOId;
    model.ImageUrl = formModel.ImageUrl ? formModel.ImageUrl : model.ImageUrl;
    model.Images = formModel.Images ? formModel.Images : model.Images;

    return model;
  }
}
