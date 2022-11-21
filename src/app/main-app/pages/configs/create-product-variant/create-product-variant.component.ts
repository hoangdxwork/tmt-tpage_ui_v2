import { CreateFormProductVariantHandler } from './../../../handler-v2/product-variant/create-form.handler';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexdb.service';
import { IRAttachmentDTO } from './../../../dto/attachment/attachment.dto';
import { ProductTemplateService } from './../../../services/product-template.service';
import { ConfigAttributeLine } from './../../../dto/configs/product/config-product-default.dto';
import { TDSNotificationService } from 'tds-ui/notification';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TDSHelperArray, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { ProductService } from 'src/app/main-app/services/product.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductDTO, ProductUOMDTO } from 'src/app/main-app/dto/product/product.dto';
import { POS_CategoryDTO } from 'src/app/main-app/dto/category/category.dto';
import { ProductUOMService } from 'src/app/main-app/services/product-uom.service';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadFile } from 'tds-ui/upload';
import { Message } from 'src/app/lib/consts/message.const';
import { PrepareCreateVariantHandler } from 'src/app/main-app/handler-v2/product-variant/prepare-create-variant.handler';

@Component({
  selector: 'create-product-variant',
  templateUrl: './create-product-variant.component.html',
  providers: [TDSDestroyService],
  host: {
    class: 'w-full h-full flex'
  },
})

export class CreateProductVariantComponent implements OnInit {
  //#region Declare
  _form!: FormGroup;
  lstProductCateg: Array<ProductCategoryDTO> = [];
  lstUOM: Array<ProductUOMDTO> = [];
  lstUOMPO: Array<ProductUOMDTO> = [];
  lstPOSCateg: Array<POS_CategoryDTO> = [];
  lstAttributeLine: ConfigAttributeLine[] = [];
  lstShowAttribute: ConfigAttributeLine[] = [];

  listCateg = [
    { value: "product", text: "Có thể lưu trữ" },
    { value: "consu", text: "Có thể tiêu thụ" },
    { value: "service", text: "Dịch vụ" }
  ];

  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';
  modelDefault!: ProductDTO;
  addToFBPage = false;

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
  constructor(private fb: FormBuilder,
    private router: Router,
    private message: TDSMessageService,
    private notification: TDSNotificationService,
    private destroy$: TDSDestroyService,
    private createFormHandler : CreateFormProductVariantHandler,
    private CRMService: CRMTeamService,
    private productService: ProductService,
    private prepareCreateVariant: PrepareCreateVariantHandler,
    private productTemplateService: ProductTemplateService,
    private productUOMService: ProductUOMService,
    private productCategoryService: ProductCategoryService,
    private productIndexDBService: ProductIndexDBService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefault();
    this.loadProductCategory();
    this.loadAttributeValues();
    this.loadUOM();
    this.loadUOMPO();
  }

  createForm() {
    this._form = this.createFormHandler.createForm(this._form, this.fb);
  }
  //#endregion Initallization

  //#region Api-request
  loadDefault() {
    this.productService.getDefault().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          delete res['@odata.context'];
          this.modelDefault = res;
          this.formatProperty(res);
        }
      });
  }

  loadProductCategory(){
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.lstProductCateg = res.value;
        },
        error: err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      });
  }

  loadAttributeValues() {
    this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.lstAttributeLine = res.value;
          this.lstShowAttribute = this.lstAttributeLine;
        },
        error: err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      }
    )
  }

  loadUOM() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.lstUOM = res.value;
        },
        error: err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      });
  }

  loadUOMPO() {
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.lstUOMPO = res.value;
        },
        error: err => {
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      });
  }
  //#endregion Api-request

  //#region Handle
  formatProperty(data: ProductDTO) {
    //TODO: xử lý array form
    if (TDSHelperArray.hasListValue(data.Images)) {
      data.Images.forEach((x: IRAttachmentDTO) => {
        this.addImages(x);
      });
    }

    if (data.DateCreated) {
      data.DateCreated = new Date(data.DateCreated);
    }
    this._form.patchValue(data);
  }

  loadDataIndexDBCache() {
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({})
  }

  addImages(data: IRAttachmentDTO) {
    let control = <FormArray>this._form.controls['Images'];
    control.push(this.initImages(data));
  }

  initImages(data: IRAttachmentDTO | null) {
    if (data != null) {
      return this.fb.group({
        MineType: [data.MineType],
        Name: [data.Name],
        ResModel: ['product.product'],
        Type: ['url'],
        Url: [data.Url]
      })
    } else {
      return this.fb.group({
        MineType: [null],
        Name: [null],
        ResModel: ['product.product'],
        Type: ['url'],
        Url: [null]
      })
    }
  }

  getUrl(url: string) {
    this._form.controls["ImageUrl"].setValue(url);
  }

  getBase64(base64: TDSSafeAny) {
    this._form.controls["Image"].setValue(base64);
  }

  onChangeAttribute(lines:ConfigAttributeLine[]){
    let attrIds = lines.map(f=> { return f.AttributeId });
    this.lstShowAttribute = this.lstAttributeLine.filter(f=> !attrIds.includes(f.AttributeId));
  }

  onChangeAddToFBPage(ev: boolean) {
    this.addToFBPage = !ev;
  }

  addProductToPageFB(ids: TDSSafeAny, name: string) {
    let facebook_PageId = this.CRMService.getCurrentTeam()?.ChannelId;

    let data = {
      model: { PageId: facebook_PageId, ProductIds: [ids] }
    }
    this.productService.addProductToFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.notification.success(
            'Thêm thành công',
            'Đã thêm sản phẩm ' + name + ' vào page.'
          );
        },
        error: error => {
          this.message.error(error?.error?.message || "Thêm mới sản phẩm vào page thất bại");
        }
      });
  }

  prepareModel() {
    let model = this.prepareCreateVariant.prepareModel(this.modelDefault, this._form.value);
    return model;
  }

  onSave() {
    let model = this.prepareModel();

    if (!TDSHelperString.hasValueString(model.Name)) {
      this.message.error('Vui lòng nhập tên sản phẩm');
      return
    }

    if(!TDSHelperArray.hasListValue(model.AttributeValues)){
      this.message.error('Vui lòng chọn thuộc tính');
      return
    }

    this.productService.insertProduct(model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          if (this.addToFBPage) {
            this.addProductToPageFB(res.Id, model.Name);
          }

          this.loadDataIndexDBCache();
          this.message.success(Message.InsertSuccess);
          this.router.navigateByUrl('/configs/product-variant');
        },
        error: error => {
          this.message.error(error?.error?.message || Message.InsertFail);
        }
      });
  }

  onBack() {
    this.router.navigateByUrl('/configs/product-variant');
  }
  //#endregion Handle
}
