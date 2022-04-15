import { Router } from '@angular/router';
import { ConfigProductVariantService } from './../config-product-variant/config-product-variant.service';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { TDSSafeAny, TDSMessageService, TDSUploadFile, TDSUploadChangeParam } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

@Component({
  selector: 'app-config-add-product-variant',
  templateUrl: './config-add-product-variant.component.html',
  styleUrls: ['./config-add-product-variant.component.scss']
})
export class ConfigAddProductVariantComponent implements OnInit {
  productTypeList:Array<TDSSafeAny>  = [];
  productGroupList:Array<TDSSafeAny>  = [];
  productUnitList:Array<TDSSafeAny>  = [];
  PosGroupList:Array<TDSSafeAny> = [];

  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';

  addProductForm!: FormGroup;

  constructor(
    private msg: TDSMessageService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder, 
    private service: ConfigProductVariantService,
    private router:Router,
    ) {
    this.initForm();
    this.initList();
  }

  ngOnInit(): void {}

  initList(){
    this.productTypeList = this.service.getTypeList();

    this.productGroupList = this.service.getProductGroupList();

    this.productUnitList = this.service.getProductUnitList();

    this.PosGroupList = this.service.getPosGroupList();
  }

  initForm(){
    this.addProductForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      sellable: new FormControl(false),
      buyable: new FormControl(false),
      active: new FormControl(false),
      pointOfSale: new FormControl(false),
      type: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      QRCode: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      attribute: new FormControl('', [Validators.required]),
      variantPrice: new FormControl(0),
      capital: new FormControl(0),
      defaultUnit: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      inventory: new FormControl('1'),
      netWeight: new FormControl(0),
      timeOut: new FormControl(0),
      PosGroup: new FormControl('', [Validators.required]),
      salePolicy: new FormControl('0'),
    });
  }

  resetForm(){
    this.addProductForm.reset({
      name: '',
      sellable: false,
      buyable: false,
      active: false,
      pointOfSale: false,
      type: '',
      productCode: '',
      QRCode: '',
      group: '',
      attribute: '',
      variantPrice: 0,
      capital: 0,
      defaultUnit: '',
      unit: '',
      inventory: '1',
      netWeight: 0,
      timeOut: 0,
      PosGroup: '',
      salePolicy: '0',
    });
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

  backToMain(){
    this.resetForm();
    this.router.navigate(['/configs/product-variant']);
  }

  onSubmit(){
    this.router.navigate(['/configs/product-variant']);
  }
}
