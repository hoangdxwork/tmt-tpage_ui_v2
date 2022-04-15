import { Router } from '@angular/router';
import { ConfigAddMadeInModalComponent } from './../components/config-add-made-in-modal/config-add-made-in-modal.component';
import { ConfigAddManufacturerModalComponent } from './../components/config-add-manufacturer-modal/config-add-manufacturer-modal.component';
import { ConfigAddVariantProductModalComponent } from './../components/config-add-variant-product-modal/config-add-variant-product-modal.component';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TDSSafeAny, TDSUploadFile, TDSMessageService, TDSUploadChangeParam, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { ConfigProductService } from './../config-products/config-product.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

@Component({
  selector: 'app-config-add-product',
  templateUrl: './config-add-product.component.html',
  styleUrls: ['./config-add-product.component.scss']
})
export class ConfigAddProductComponent implements OnInit {
  variantTableData:Array<TDSSafeAny> = [];
  productTypeList:Array<TDSSafeAny>  = [];
  productGroupList:Array<TDSSafeAny>  = [];
  productUnitList:Array<TDSSafeAny>  = [];
  PosGroupList:Array<TDSSafeAny> = [];
  superviseList:Array<TDSSafeAny> = [];
  manufacturerList:Array<TDSSafeAny> = [];
  importerList:Array<TDSSafeAny> = [];
  distributorList:Array<TDSSafeAny> = [];
  nationList:Array<TDSSafeAny> = [];


  fileList: TDSUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl = '';

  imageList: TDSUploadFile[] = [];

  addProductForm!: FormGroup;
  

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private msg: TDSMessageService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private service:ConfigProductService,
    private router:Router,
  ) { 
    this.initListData();
    this.initForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.variantTableData = [
      {
        id:1,
        name:'INV/2021/0304',
        price:100000,
        active:false
      }
    ];
  }

  initListData(){
    this.productTypeList = this.service.getTypeList();

    this.productGroupList = this.service.getProductGroupList();

    this.productUnitList = this.service.getProductUnitList();

    this.PosGroupList = this.service.getPosGroupList();

    this.manufacturerList = this.service.getManufacturerList();

    this.importerList = this.service.getImporterList();

    this.distributorList = this.service.getDistributorList();
    
    this.nationList = this.service.getNationList();

    this.superviseList = [
      {
        id:1,
        name:'Theo dõi'
      },
      {
        id:2,
        name:'Không theo dõi'
      }
    ]
  }

  initForm(){
    this.addProductForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      sellable: new FormControl(false),
      buyable: new FormControl(false),
      isCombo: new FormControl(false),
      active: new FormControl(false),
      pointOfSale: new FormControl(false),
      allowToSellAtAnotherCompany: new FormControl(false),
      type: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      QRCode: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      attribute: new FormControl('', [Validators.required]),
      price: new FormControl(0),
      capital: new FormControl(0),
      defaultUnit: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      inventory: new FormControl('1'),
      images: new FormControl([]),
      supervise: new FormControl('', [Validators.required]),
      netWeight: new FormControl(0),
      volumn: new FormControl(0),
      PosGroup: new FormControl('', [Validators.required]),
      describeProduct: new FormControl(''),
      describeOnProductReport: new FormControl(''),
      manufacturer: new FormControl('', [Validators.required]),
      importer: new FormControl('', [Validators.required]),
      distributor: new FormControl('', [Validators.required]),
      madeIn: new FormControl('', [Validators.required]),
      produceInYear: new FormControl(0),
      components: new FormControl(''),
      technicalParameter: new FormControl(''),
      attention: new FormControl(''),
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
      price: 0,
      capital: 0,
      defaultUnit: '',
      unit: '',
      inventory: '1',
      images:[],
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
    if (info.file.status === 'done') {
        this.msg.success(`${info.file.name} file uploaded successfully`);
        this.addProductForm.value.images.push(info.file);
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

  addNewVariants(event:TDSSafeAny){
    const modal = this.modalService.create({
      title: 'Thêm biến thể sản phẩm',
      content: ConfigAddVariantProductModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addproductGroup(event:TDSSafeAny){

  }

  addManufacturer(){
    const modal = this.modalService.create({
      title: 'Thêm nhà sản xuất',
      content: ConfigAddManufacturerModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  addImporter(){

  }

  addDistributor(){

  }

  addMadeIn(){
    const modal = this.modalService.create({
      title: 'Thêm xuất xứ',
      content: ConfigAddMadeInModalComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get result from modal here
      }
    });
  }

  backToMain(){
    this.router.navigate(['configs/products']);
    this.resetForm();
  }

  onSubmit(){
    this.router.navigate(['configs/products']);
  }
}
