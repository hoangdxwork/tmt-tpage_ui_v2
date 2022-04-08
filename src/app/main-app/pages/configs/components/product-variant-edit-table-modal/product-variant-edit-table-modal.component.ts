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
  @Input() data:TDSSafeAny;

  groupList:Array<TDSSafeAny> = [];
  unitList:Array<TDSSafeAny> = [];
  editForm!: FormGroup;
  imageList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = 'assets/images/config/';

  constructor(
    private modal: TDSModalRef, 
    private formBuilder: FormBuilder, 
    private service:ConfigProductVariantService, 
    private msg: TDSMessageService, 
    private http: HttpClient
    ) { 
    
    this.editForm = new FormGroup({});
    this.groupList = this.service.getProductGroupList();
    this.unitList =  this.service.getProductUnitList();
  }

  ngOnInit(): void {
    console.log(this.data)
    this.initData();
  }

  initData(){
    this.imageList = this.data.images;
    this.editForm = this.formBuilder.group({
      name: new FormControl(this.data.name, [Validators.required]),
      group: new FormControl(this.data.group, [Validators.required]),
      unit: new FormControl(this.data.unit, [Validators.required]),
      productPrice: new FormControl(this.data.productPrice, [Validators.required]),
    })
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

  save() {
      this.onSubmit();
  }
}
