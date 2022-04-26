import { ProductCategoryService } from './../../../../services/product-category.service';
import { OdataProductUOMDTOV2 } from './../../../../dto/product/product-uom.dto';
import { ProductUOMService } from './../../../../services/product-uom.service';
import { Category } from './../../../../dto/configs/sale-config.dto';
import { ODataProductCategoryDTOV2, ProductCategoryDTO, ProductCategoryDTOV2 } from './../../../../dto/product/product-category.dto';
import { ProductUOMDTOV2 } from './../../../../dto/product/product-uom.dto';
import { ProductDTO, ProductUOMDTO } from './../../../../dto/product/product.dto';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ProductService } from './../../../../services/product.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { ConfigProductVariantService } from '../../config-product-variant/config-product-variant.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny, TDSUploadFile, TDSUploadChangeParam, TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'app-product-variant-edit-table-modal',
  templateUrl: './product-variant-edit-table-modal.component.html',
  styleUrls: ['./product-variant-edit-table-modal.component.scss']
})
export class ProductVariantEditTableModalComponent implements OnInit {
  @Input() productId!: number;

  dataProduct!: ProductDTO;
  listProductCategory!: ProductCategoryDTO[];
  listProductUOM!: ProductUOMDTO[];
  editForm!: FormGroup;
  imageList: TDSUploadFile[] = [];
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
        ImageUrl: [null],
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
      this.dataProduct = res
      console.log(this.dataProduct)
      this.uploadUrl = this.dataProduct.ImageUrl
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
    form.Name.setValue(this.dataProduct.Name);
    form.CategId.setValue(this.dataProduct.Categ.Id);
    form.UOMId.setValue(this.dataProduct.UOM.Id);
    form.PriceVariant.setValue(this.dataProduct.LstPrice);
  }


  onSubmit() {
      if (!this.editForm.invalid) {
        this.modal.destroy(this.editForm);
      }
  }

  cancel() {
      this.modal.destroy(null);
  }

  getImageArray(ev: TDSSafeAny){

  }

  prepareModel() {
    let formModel = this.editForm.value
    if(formModel.Name){
      this.dataProduct.Name = formModel.Name
    }
    if (formModel.Categ) {
      let modelCateg = this.listProductCategory.find(x => x.Id == formModel.Categ)
      if (modelCateg) {
        this.dataProduct.Categ = modelCateg;
        this.dataProduct.CategId = modelCateg.Id;
      }
    } else {
      this.dataProduct.CategId = this.dataProduct.Categ.Id;
    }
    if (formModel.UOMId) {
      let modelUOM = this.listProductUOM.find(x => x.Id == formModel.UOMId)
      if (modelUOM) {
        this.dataProduct.UOM = modelUOM;
        this.dataProduct.UOMId = modelUOM.Id;
      }
    } else {
      this.dataProduct.UOMId = this.dataProduct.UOM.Id;
    }
    if(formModel.PriceVariant){
      this.dataProduct.PriceVariant = formModel.PriceVariant;
    }
    this.dataProduct.UOMPOId = this.dataProduct.UOMPO.Id;

    console.log(this.dataProduct)
    return this.dataProduct
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
