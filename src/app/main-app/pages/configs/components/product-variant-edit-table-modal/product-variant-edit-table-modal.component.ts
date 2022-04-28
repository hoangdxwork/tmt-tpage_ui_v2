import { IRAttachmentDTO } from './../../../../dto/attachment/attachment.dto';
import { ProductCategoryService } from './../../../../services/product-category.service';
import { ProductUOMService } from './../../../../services/product-uom.service';
import { ProductCategoryDTO } from './../../../../dto/product/product-category.dto';
import { ProductDTO, ProductUOMDTO } from './../../../../dto/product/product.dto';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ProductService } from './../../../../services/product.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TDSModalRef, TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'app-product-variant-edit-table-modal',
  templateUrl: './product-variant-edit-table-modal.component.html',
  styleUrls: ['./product-variant-edit-table-modal.component.scss']
})
export class ProductVariantEditTableModalComponent implements OnInit {
  @Input() productId!: number;

  modelDefault!: ProductDTO;
  listProductCategory!: ProductCategoryDTO[];
  listProductUOM!: ProductUOMDTO[];
  editForm!: FormGroup;
  imageList: Array<TDSSafeAny> = [];
  imageListUpLoad: Array<TDSSafeAny> = [];
  imageModel: Array<TDSSafeAny> = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  isLoading: boolean = false;
  uploadUrl = 'assets/images/config/';
  private destroy$ = new Subject<void>();


  constructor(
    private modal: TDSModalRef, 
    private formBuilder: FormBuilder, 
    private productService: ProductService,
    private msg: TDSMessageService, 
    private http: HttpClient,
    private message: TDSMessageService,
    private productUOMService : ProductUOMService,
    private productCategoryService: ProductCategoryService,
    ) { 
    
    this.editForm = new FormGroup({});
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  createForm(){
    this.editForm = this.formBuilder.group({
      Name: [null, Validators.required],
        PriceVariant: [null],
        ImageUrl: [''],
        IsAvailableOnTPage: [null],
        CategId: [null],
        UOMId: [null],
        UOMPOId: [null],
        POSCategId: [null],
        Images: this.formBuilder.array([])
    })
  }

  loadData(){
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.listProductUOM = res.value;
      this.getProductCategory();
    },err=>{
      this.message.error(err.error.message || 'Load dữ liệu thất bại!!')
    })
  }

  getByIdProduct(){
    this.isLoading = true
    this.productService.getById(this.productId).pipe(takeUntil(this.destroy$)).subscribe((res: any)=>{
      delete res['@odata.context'];
      this.modelDefault = res
      if(this.modelDefault.Images){
        this.modelDefault.Images.forEach(el=>{
          let model = {
            url: el.Url,
            type: el.MineType,
            name: el.Name
          }
          this.imageList.push(model)
        })
      }
      this.updateForm();
      this.isLoading = false
    },
    err=>{
      this.message.error(err.error.message || 'Load dữ liệu thất bại!')
      this.isLoading = false;
    } )
  }

  getProductCategory(){
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.listProductCategory = res.value;
      this.getByIdProduct();
    }, err=>{
      this.message.error( err.error.message || 'load dữ liệu nhóm sản phẩm thất bại!')
    })
  }

  updateForm(){
    let form = this.editForm.controls
    form.Name.setValue(this.modelDefault.Name);
    form.CategId.setValue(this.modelDefault.Categ.Id);
    form.UOMId.setValue(this.modelDefault.UOM.Id);
    form.PriceVariant.setValue(this.modelDefault.LstPrice);
    form.ImageUrl.setValue(this.modelDefault.ImageUrl);
  }


  onSubmit() {
      if (!this.editForm.invalid) {
        this.modal.destroy(this.editForm);
      }
  }

  cancel() {
      this.modal.destroy(null);
  }


  prepareModel() {
    let formModel = this.editForm.value
    if(formModel.Name){
      this.modelDefault.Name = formModel.Name
    }
    if (formModel.Categ) {
      let modelCateg = this.listProductCategory.find(x => x.Id == formModel.Categ)
      if (modelCateg) {
        this.modelDefault.Categ = modelCateg;
        this.modelDefault.CategId = modelCateg.Id;
      }
    } else {
      this.modelDefault.CategId = this.modelDefault.Categ.Id;
    }
    if (formModel.UOMId) {
      let modelUOM = this.listProductUOM.find(x => x.Id == formModel.UOMId)
      if (modelUOM) {
        this.modelDefault.UOM = modelUOM;
        this.modelDefault.UOMId = modelUOM.Id;
      }
    } else {
      this.modelDefault.UOMId = this.modelDefault.UOM.Id;
    }
    if(formModel.PriceVariant){
      this.modelDefault.PriceVariant = formModel.PriceVariant;
    }
    this.modelDefault.UOMPOId = this.modelDefault.UOMPO.Id;
    if(this.imageListUpLoad.length != 0){
      this.imageListUpLoad.forEach(img => {
        this.addImages({
          MineType: img.type,
          Name: img.name,
          ResModel: 'product.product',
          Type: 'url',
          Url: img.url
        });
      });
      this.modelDefault.Images = this.imageModel
    }
    if(formModel.Images){
    }
    return this.modelDefault
  }

  getImageArray(ev: Array<TDSSafeAny>){
    this.imageListUpLoad = ev
  }

  addImages(data: any) {
    this.imageModel.push(this.initImages(data));
  }

  initImages(data: any | null) {
    if(data != null) {
      return {
          MineType: data.MineType,
          Name: data.Name,
          ResModel: data.ResModel,
          Type: data.Type,
          Url: data.Url
      };
    }
    return
  }

  getUrl(ev: TDSSafeAny){
    this.modelDefault.ImageUrl = ev
  }

  onSave() {
    let model = this.prepareModel();

    if (!model.Name) {
      this.message.error('Vui lòng nhập tên sản phẩm');
    } else {
      let data = JSON.stringify(model)
      this.productService.updateProduct(this.productId, data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.message.success('Cập nhật thành công!');
        this.createForm();
        this.modal.destroy(true)
      }, error => {
        this.message.error('Thao tác thất bại!');
      });
    }
  }
}
