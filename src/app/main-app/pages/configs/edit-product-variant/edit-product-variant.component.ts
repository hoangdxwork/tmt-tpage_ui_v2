import { CreateFormProductVariantHandler } from './../../../handler-v2/product-variant/create-form.handler';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductUOMDTO, ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductUOMService } from 'src/app/main-app/services/product-uom.service';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexdb.service';
import { THelperCacheService } from 'src/app/lib';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PrepareEditVariantHandler } from 'src/app/main-app/handler-v2/product-variant/prepare-edit-variant.handler';

@Component({
  selector: 'edit-product-variant',
  templateUrl: './edit-product-variant.component.html',
  providers: [TDSDestroyService]
})

export class EditProductVariantComponent implements OnInit {
  //#region Declare
  @Input() id!: number;

  _form!: FormGroup;
  dataModel!: ProductDTO;
  lstProductCategory!: ProductCategoryDTO[];
  lstProductUOM!: ProductUOMDTO[];
  imageList: Array<TDSSafeAny> = [];
  imageModel: Array<TDSSafeAny> = [];
  isLoading: boolean = false;

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
  //#endregion Declare

  //#region Initallization
  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private createFormHandler : CreateFormProductVariantHandler,
    private productIndexDBService: ProductIndexDBService,
    private destroy$: TDSDestroyService,
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
    this._form = this.createFormHandler.createEditForm(this._form, this.fb);
  }
  //#endregion Initallization

  //#region Api-request
  loadData() {
    this.isLoading = true;
    this.productService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (res: any) => {
            if(res) {
              delete res['@odata.context'];
              this.dataModel = {...res};

              this.updateForm(res);
            }

            this.isLoading = false;
          },
          error: error => {
            this.isLoading = false;
            this.message.error(error.error.message || 'Load dữ liệu thất bại');
            this.cdRef.detectChanges();
          }
        })
  }

  loadProductCategory() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.lstProductCategory = [...res.value];
        },
        error: error => {
          this.message.error(error.error.message || 'load dữ liệu nhóm sản phẩm thất bại');
        }
      })
  }

  loadUOM() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.lstProductUOM = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || 'Load dữ liệu thất bại');
        }
      })
  }
  //#endregion Api-request

  //#region Handle
  updateForm(data: TDSSafeAny) {

    this._form.controls['Categ'].setValue(data.Categ);
    this._form.controls['UOM'].setValue(data.UOM);
    this._form.controls['UOMPO'].setValue(data.UOMPO);
    this._form.patchValue(data);
    this._form.controls['OrderTag'].setValue(this.stringToStringArray(data.OrderTag) || null);


    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.map((x: any) => {
        this.addImages(x);
      })
    }
  }

  loadDataIndexDBCache() {
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({})
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

    this.productService.updateProduct(this.id, model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.message.success('Cập nhật thành công!');
          this.loadDataIndexDBCache();
          this.modal.destroy(true);
        },
        error: error => {
          this.message.error(error?.error?.message || 'Thao tác thất bại');
        }
      });
  }
  onChangeOrderTag(event: string[]) {
    let strs = [...this.checkInputMatch(event)];
    this._form.controls.OrderTag.setValue(strs);
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
    if(matchRex || !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim())) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  stringToStringArray(value: string): any {

    if(TDSHelperString.isString(value) && TDSHelperString.hasValueString(value)){
        if(!value.includes(',')) {
            return [value];
        }
        return (value as string).split(",");
    }

    if(TDSHelperArray.isArray(value)){
        return value;
    }

    return null;
}
}
