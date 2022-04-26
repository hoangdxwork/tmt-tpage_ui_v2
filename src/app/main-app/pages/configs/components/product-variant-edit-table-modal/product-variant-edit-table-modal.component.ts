import { OdataProductUOMDTOV2 } from './../../../../dto/product/product-uom.dto';
import { ProductUOMService } from './../../../../services/product-uom.service';
import { Category } from './../../../../dto/configs/sale-config.dto';
import { ODataProductCategoryDTOV2, ProductCategoryDTOV2 } from './../../../../dto/product/product-category.dto';
import { ProductUOMDTOV2 } from './../../../../dto/product/product-uom.dto';
import { ProductDTO } from './../../../../dto/product/product.dto';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ProductService } from './../../../../services/product.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { ConfigProductVariantService } from '../../config-product-variant/config-product-variant.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny, TDSUploadFile, TDSUploadChangeParam, TDSMessageService } from 'tmt-tang-ui';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
@Component({
  selector: 'app-product-variant-edit-table-modal',
  templateUrl: './product-variant-edit-table-modal.component.html',
  styleUrls: ['./product-variant-edit-table-modal.component.scss']
})
export class ProductVariantEditTableModalComponent implements OnInit {
  @Input() productId!: number;

  dataProduct!: ProductDTO;
  listProductCategory!: ProductCategoryDTOV2[];
  listProductUOM!: ProductUOMDTOV2[];
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
    private service:ConfigProductVariantService, 
    private productService: ProductService,
    private msg: TDSMessageService, 
    private http: HttpClient,
    private message: TDSMessageService,
    private productUOMService : ProductUOMService,
    ) { 
    
    this.editForm = new FormGroup({});
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  createForm(){
    this.editForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      UOMId: new FormControl('', [Validators.required]),
      productPrice: new FormControl('', [Validators.required]),
    })
  }

  loadData(){
    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe((res:OdataProductUOMDTOV2)=>{
      this.listProductUOM = res.value;
      this.getProductCategory();
    },err=>{
      this.message.error(err.error.message || 'Load dữ liệu thất bại!!')
    })
  }

  getByIdProduct(){
    this.isLoading = true
    this.productService.getById(this.productId).pipe(takeUntil(this.destroy$)).subscribe((res: ProductDTO)=>{
      this.dataProduct = res
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
    this.productService.getProductCategory().pipe(takeUntil(this.destroy$)).subscribe((res:ODataProductCategoryDTOV2)=>{
      this.listProductCategory = res.value;
      this.getByIdProduct();
    }, err=>{
      this.message.error( err.error.message || 'load dữ liệu nhóm sản phẩm thất bại!')
    })
  }

  updateForm(){
    let form = this.editForm.controls
    form.name.setValue(this.dataProduct.Name);
    form.categoryId.setValue(this.dataProduct.Categ.Id);
    form.UOMId.setValue(this.dataProduct.UOM.Id);
    form.productPrice.setValue(this.dataProduct.LstPrice);
  }

  handlePreview = async (file: TDSUploadFile) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleChange(info: TDSUploadChangeParam): void {
    // if (info.file.status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    // }
    if (info.file.status === 'done') {
        this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  handleUpload = (item: any) => {
    const formData = new FormData();
    
    formData.append('mediaFile', item.file as any, item.file.name);
    formData.append('id', '0000000000000051');

    const req = new HttpRequest('POST', this.uploadUrl, formData);
    return this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (res:TDSSafeAny) => {   
            if(res && res.body)
            {
                const data = res.body;
                item.file.url = data.mediaUrl;
            }
            item.onSuccess(item.file);
        },
        (err) => {
            item.onError({statusText:err.error?.error?.details}, item.file);
        }
    )
  }

  handleDownload=(file: TDSUploadFile)=>{
    window.open(file.response.url);
  }

  onselectProductGroup(id:TDSSafeAny){
    
  }

  onselectProductUnit(id:TDSSafeAny){

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
  }
  onSave() {
  }
}
