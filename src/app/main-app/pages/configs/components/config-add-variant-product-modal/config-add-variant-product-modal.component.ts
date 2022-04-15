import { ConfigProductService } from './../../config-products/config-product.service';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { TDSSafeAny, TDSUploadFile, TDSMessageService, TDSUploadChangeParam, TDSModalRef } from 'tmt-tang-ui';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

@Component({
  selector: 'app-config-add-variant-product-modal',
  templateUrl: './config-add-variant-product-modal.component.html',
  styleUrls: ['./config-add-variant-product-modal.component.scss']
})
export class ConfigAddVariantProductModalComponent implements OnInit {
  productTypeList:Array<TDSSafeAny>  = [];

  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';

  addProductVariantForm!:FormGroup;

  constructor(
    private modal: TDSModalRef, 
    private msg: TDSMessageService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private service:ConfigProductService
  ) { 
      this.initForm();
      this.productTypeList = this.service.getTypeList();
  }

  ngOnInit(): void {
  }

  initForm(){
    this.addProductVariantForm = this.formBuilder.group({
      sellable: new FormControl(false),
      buyable: new FormControl(false),
      active: new FormControl(false),
      type: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      QRCode: new FormControl('', [Validators.required]),
      attribute: new FormControl('', [Validators.required]),
      price: new FormControl(0),
    });
  }

  resetForm(){
    this.addProductVariantForm.reset({
      sellable: false,
      buyable: false,
      active: false,
      type: '',
      productCode: '',
      QRCode: '',
      attribute: '',
      price: 0,
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
    if (info.file.status === 'done') {
        this.msg.success(`${info.file.name} file uploaded successfully`);
        this.addProductVariantForm.value.images.push(info.file);
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

  onSubmit() {
    if (!this.addProductVariantForm.invalid) {
      this.modal.destroy(this.addProductVariantForm);
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
