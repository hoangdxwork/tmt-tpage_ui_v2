import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { ApplicationUserDTO } from "src/app/main-app/dto/account/application-user.dto";
import { AutoOrderConfigDTO, AutoOrderConfig_ContentToOrderDTO } from "src/app/main-app/dto/configs/post/order-config.dto";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { DataPouchDBDTO } from "src/app/main-app/dto/product-pouchDB/product-pouchDB.dto";
import { ApplicationUserService } from "src/app/main-app/services/application-user.service";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalRef, TDSModalService, TDSSafeAny } from "tmt-tang-ui";
import * as XLSX from 'xlsx';
import { ModalListProductComponent } from "../../modal-list-product/modal-list-product.component";

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html'
})

export class PostOrderConfigComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data!: FacebookPostItem;

  formOrderConfig!: FormGroup;
  tags: any[] = [];
  fbid: any;
  isLoading: boolean = false;
  dataModel: any;
  private destroy$ = new Subject();

  // add more template
  prefixMoreTemplate: string = '';
  suffixMoreTemplate: string = '';
  fromMoreTemplate: number = 0;
  toMoreTemplate: number = 1;
  isVisibleRangeGenerate: boolean = false;

  lstTags$!: Observable<CRMTagDTO[]>;
  lstUser$!: Observable<ApplicationUserDTO[]>;

  constructor(
    private fb: FormBuilder,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService,
    private applicationUserService: ApplicationUserService,
    private modelRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService
  ) { }

  get textContentToOrdersFormGroups() {
    return (this.formOrderConfig?.get("TextContentToOrders") as FormArray);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.data?.firstChange === true) this.createForm();
    else this.resetForm();

    if(changes?.data?.currentValue) {
      this.loadOrderConfig(this.data.fbid);
    }

  }

  ngOnInit(): void {
    this.loadTag();
    this.loadUser();
  }

  loadTag() {
    this.lstTags$ = this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  createForm() {
    this.formOrderConfig = this.fb.group({
      IsEnableOrderAuto: [false],
      IsForceOrderWithAllMessage: [false],
      IsOnlyOrderWithPartner: [false],
      IsOnlyOrderWithPhone: [false],
      IsForceOrderWithPhone: [false],
      IsForcePrintWithPhone: [false],
      TextContentToExcludeOrder: [null],
      MinLengthToOrder: [0],
      MinLengthToVisible: [0],
      MaxCreateOrder: [0],
      TextContentToOrders: this.fb.array([]),
      selectedWord1s: [null],
      immediateApply: [false],
      ExcludedPhones: [null],
      ExcludedStatusNames: this.fb.array([]),
      IsEnableAutoAssignUser: [false],
      Users: [null],
      LiveCampaignId: [null]
    })
  }

  resetForm() {
    this.formOrderConfig.reset();
  }

  loadOrderConfig(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getOrderConfig(postId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        console.log(res);
        this.updateForm(res);
      });
  }

  updateForm(data: AutoOrderConfigDTO) {
    if(!TDSHelperObject.hasValue(data)) return;

    this.formOrderConfig.patchValue(data);

    if (data.TextContentToExcludeOrder) {
      this.formOrderConfig.controls['selectedWord1s'].setValue(data.TextContentToExcludeOrder.split(','));
    }

    if (data.ExcludedPhones) {
      this.formOrderConfig.controls.ExcludedPhones.setValue(data.ExcludedPhones);
    }

    if (data.ExcludedStatusNames) {
      this.formOrderConfig.setControl('ExcludedStatusNames', this.fb.array(data.ExcludedStatusNames));
    }

    if(TDSHelperArray.hasListValue(data.TextContentToOrders)) {
      this.initTextContentToOrders(data.TextContentToOrders);
    }

    console.log(this.formOrderConfig.value);
  }

  initTextContentToOrders(data: AutoOrderConfig_ContentToOrderDTO[]) {
    data.forEach(content => {
      const control = <FormArray>this.formOrderConfig.controls['TextContentToOrders'];
      control.push(this.initOrderContent(content));
    });
  }

  initOrderContent(data: AutoOrderConfig_ContentToOrderDTO | undefined): FormGroup {
    let currentIndex = this.formOrderConfig.value.TextContentToOrders.length;

    let formGroup = this.fb.group({
      Index: [currentIndex, Validators.required],
      Content: [null],
      IsActive: [true],
      ContentWithAttributes: [null],
      Product: [null],
      selectedWord2s: [null],
      selectedWord3s: [null],
    });

    if(TDSHelperObject.hasValue(data) && data) {
      formGroup.patchValue(data);

      if(TDSHelperString.hasValueString(data.Content)) {
        formGroup.controls['selectedWord2s'].setValue(data.Content.split(','));
      }

      if(TDSHelperString.hasValueString(data.ContentWithAttributes)) {
        formGroup.controls['selectedWord3s'].setValue(data.ContentWithAttributes.split(','));
      }
    }

    return formGroup;
  }

  addTemplate() {
    const control = <FormArray>this.formOrderConfig.controls['TextContentToOrders'];
    control.push(this.initOrderContent(undefined));
    this.message.info(Message.ConversationPost.AddTemplateSuccess);
  }

  changeMoreTemplate() {
    this.isVisibleRangeGenerate = !this.isVisibleRangeGenerate;
  }

  removeTemplate(index: number) {
    (this.formOrderConfig.get("TextContentToOrders") as FormArray).removeAt(index);
  }

  removeAllTemplate() {
    let currentIndex = this.formOrderConfig.value.TextContentToOrders.length;

    if(currentIndex < 1) {
      this.message.info(Message.EmptyData);
      return;
    }

    (this.formOrderConfig.get("TextContentToOrders") as FormArray).clear();
  }

  onCannelMoreTemplate() {
    this.prefixMoreTemplate = '';
    this.suffixMoreTemplate = '';
    this.fromMoreTemplate = 0;
    this.toMoreTemplate = 1;

    this.isVisibleRangeGenerate = false;
  }

  addMoreTemplate() {
    if(this.fromMoreTemplate > this.toMoreTemplate) {
      this.message.error(Message.ConversationPost.ErrorNumberMoreTemplate);
      return;
    }

    let currentIndex = this.formOrderConfig.value?.TextContentToOrders.length || 0;

    for(let i = this.fromMoreTemplate; i <= this.toMoreTemplate; i++) {
      let content = `${this.prefixMoreTemplate}${i}${this.suffixMoreTemplate}`;

      let control = this.fb.group({
        Index: currentIndex,
        Content: [content],
        Product: null,
        selectedWord2s: [[content]],
      });

      (this.formOrderConfig.get("TextContentToOrders") as FormArray).push(control);
      currentIndex++;
    }

    this.message.info(Message.ConversationPost.AddMoreTemplateSuccess);
  }

  addExcludedPhone(event: any) {
    debugger;
    const target: DataTransfer = <DataTransfer>(event.target);
    const reader: FileReader = new FileReader();

    reader.readAsBinaryString(target.files[0]);

    let fileName = target.files[0].name;
    let typeFile = this.isCheckFile(fileName);

    if(typeFile) {
      let result = [];

      reader.onload = (e: any) => {
        const binaryStr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

        for (var i = 0; i < wb.SheetNames.length; ++i) {
          const wsName: string = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[wsName];
          const data: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });

          var name_col = Object.keys(data[0]);
          result = data.map((x: any) => {
            return x[name_col[0]].toString();
          });

          if (typeFile == 'txt' || typeFile == 'xlsx') {
            result.unshift(name_col[0]).toString();
          }

          let excludedPhonesValue = this.formOrderConfig.value.ExcludedPhones || [];
          result = [...result, ...excludedPhonesValue];

          this.formOrderConfig.controls.ExcludedPhones.setValue(result);
          break;
        }
      };
    }
  }

  isCheckFile(fileName: string) {
    let arr = fileName.split(".");
    let name = arr[arr.length - 1];

    if (name == "txt") {
      return "txt";
    }
    else if (name == "xlsx") {
      return "xlsx";
    }

    this.message.error(Message.ConversationPost.FileNotFormat);
    return null;
  }

  onSave() {

  }

  showModalListProduct(index: number) {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        useListPrice: true,
        isSelectProduct: true
      }
    });

    modal.componentInstance?.selectProduct.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        // let product = this.convertDetail(res);
        // this.selectProduct(product);
      }
    });
  }

  onCannel() {
    this.modelRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
