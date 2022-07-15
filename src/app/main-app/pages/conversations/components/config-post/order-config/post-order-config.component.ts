import { StringHelperV2 } from './../../../../../shared/helper/string.helper';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, Subscription } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { ApplicationUserDTO } from "src/app/main-app/dto/account/application-user.dto";
import { AutoOrderConfigDTO, AutoOrderConfig_ContentToOrderDTO, AutoOrderConfig_ProductDTO } from "src/app/main-app/dto/configs/post/order-config.dto";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { DataPouchDBDTO } from "src/app/main-app/dto/product-pouchDB/product-pouchDB.dto";
import { ProductDTO } from "src/app/main-app/dto/product/product.dto";
import { ApplicationUserService } from "src/app/main-app/services/application-user.service";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { ProductService } from "src/app/main-app/services/product.service";
import * as XLSX from 'xlsx';
import { ModalListProductComponent } from "../../modal-list-product/modal-list-product.component";
import { MDBInnerCreatedByDTO } from 'src/app/main-app/dto/conversation/inner.dto';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { LiveCampaignDetailDataDTO, SaleOnline_LiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';

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
  isImmediateApply: boolean = false;

  lstTags$!: Observable<CRMTagDTO[]>;
  lstUser$!: Observable<ApplicationUserDTO[]>;
  currentLiveCampaign!: SaleOnline_LiveCampaignDTO | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService,
    private applicationUserService: ApplicationUserService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private productService: ProductService,
    private liveCampaignService: LiveCampaignService
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

  loadLiveCampaignById(liveCampaignId: string | undefined) {
    if(liveCampaignId) {
      this.liveCampaignService.getById(this.data.live_campaign_id)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.currentLiveCampaign = res;
      });
    }
    else {
      this.currentLiveCampaign = undefined;
    }

  }

  createForm() {
    this.formOrderConfig = this.formBuilder.group({
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
      TextContentToOrders: this.formBuilder.array([]),
      selectedWord1s: [null],
      ExcludedPhones: [null],
      ExcludedStatusNames: [null],
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
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.updateForm(res);
        this.loadLiveCampaignById(res?.LiveCampaignId);
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
      this.formOrderConfig.controls.ExcludedStatusNames.setValue(data.ExcludedStatusNames);
    }

    if(TDSHelperArray.hasListValue(data.TextContentToOrders)) {
      this.initTextContentToOrders(data.TextContentToOrders);
    }
  }

  initTextContentToOrders(data: AutoOrderConfig_ContentToOrderDTO[]) {
    data.forEach(content => {
      const control = <FormArray>this.formOrderConfig.controls['TextContentToOrders'];
      control.push(this.initOrderContent(content));
    });
  }

  initOrderContent(data: AutoOrderConfig_ContentToOrderDTO | undefined): FormGroup {
    let currentIndex = this.formOrderConfig.value.TextContentToOrders.length;

    let formGroup = this.formBuilder.group({
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

  initTextContentToDetail(details: LiveCampaignDetailDataDTO[], liveCampaign: SaleOnline_LiveCampaignDTO) {
    details.forEach(content => {
      const control = <FormArray>this.formOrderConfig.controls['TextContentToOrders'];
      control.push(this.initOrderContentLiveCampaign(content, liveCampaign));
    });
  }

  initOrderContentLiveCampaign(data: LiveCampaignDetailDataDTO, liveCampaign: SaleOnline_LiveCampaignDTO): FormGroup {
    let currentIndex = this.formOrderConfig.value.TextContentToOrders.length;

    let formGroup = this.formBuilder.group({
      Index: [currentIndex, Validators.required],
      Content: [null],
      IsActive: [true],
      ContentWithAttributes: [null],
      Product: [null],
      selectedWord2s: [null],
      selectedWord3s: [null],
    });

    let product = this.defaultOrderConfigProductByLiveCampaignDetail(data, liveCampaign.EnableQuantityHandling);
    let selectedWord2s: string[] = [];
    let selectedWord3s: string[] = [];

    if(TDSHelperObject.hasValue(data) && data) {
      formGroup.patchValue(data);

      if(TDSHelperString.hasValueString(data.Tags)) {
        selectedWord2s = data.Tags.split(',');
      }

      if(TDSHelperString.hasValueString(data.ProductTemplateName)) {
        if(TDSHelperString.hasValueString(data.Tags)) {
          selectedWord3s = data.Tags.split(',');
        }
      }
    }

    formGroup.controls.Product.setValue(product);
    formGroup.controls.selectedWord2s.setValue(selectedWord2s);
    formGroup.controls.Content.setValue(selectedWord2s.toString());
    formGroup.controls.selectedWord3s.setValue(selectedWord3s);
    formGroup.controls.ContentWithAttributes.setValue(selectedWord3s.toString());

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

      let control = this.formBuilder.group({
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

  showModalListProduct(index: number) {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl'
    });

    modal.afterClose.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        this.selectProduct(res, index);
      }
    });
  }

  selectProduct(product: DataPouchDBDTO, index: number) {
    this.productService.getAttributeValuesById(product.Id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      let defaultProductConfig = this.defaultOrderConfigProduct(res);
      let selectedWord2s = this.handleAddWord2s(defaultProductConfig);
      let selectedWord3s = selectedWord2s;

      let currentIndex = (this.formOrderConfig.get("TextContentToOrders") as FormArray).at(index).value;
      currentIndex.Product = defaultProductConfig;
      currentIndex.selectedWord2s = selectedWord2s;
      currentIndex.Content = selectedWord2s;
      currentIndex.selectedWord3s = selectedWord3s; // Gán 3s thành 2s
      currentIndex.ContentWithAttributes = selectedWord3s;

      (this.formOrderConfig.get("TextContentToOrders") as FormArray).at(index).setValue(currentIndex);
    });
  }

  defaultOrderConfigProduct(product: ProductDTO): AutoOrderConfig_ProductDTO {
    let result = {} as AutoOrderConfig_ProductDTO;

    result.ProductId = product.Id;
    result.ProductCode = product.DefaultCode;
    result.ProductName = product.Name;
    result.ProductNameGet = product.NameGet;
    result.Price = product.LstPrice;
    result.UOMId = product.UOMId;
    result.UOMName = product.UOMName;

    result.Quantity = undefined;
    result.QtyLimit = undefined;
    result.QtyDefault = undefined;
    result.IsEnableRegexQty = false;
    result.IsEnableRegexAttributeValues = false;
    result.IsEnableOrderMultiple = false;
    result.AttributeValues = [];
    result.DescriptionAttributeValues = [];

    if(TDSHelperArray.hasListValue(product?.AttributeValues)) {
      let listName = product.AttributeValues.map(x => x.Name);
      let listNameGet = product.AttributeValues.map(x => x.NameGet);

      result.AttributeValues = listName;
      result.DescriptionAttributeValues = listNameGet;

      result.IsEnableRegexAttributeValues = true;
    }

    return result;
  }

  defaultOrderConfigProductByLiveCampaignDetail(detail: LiveCampaignDetailDataDTO, isEnableQuantityHandling: boolean): AutoOrderConfig_ProductDTO {
    let result = {} as AutoOrderConfig_ProductDTO;

    result.ProductId = detail.ProductId;
    result.ProductCode = detail.ProductCode;
    result.ProductName = detail.ProductName;
    result.ProductNameGet = detail.ProductName;
    result.Price = detail.Price;
    result.UOMId = detail.UOMId;
    result.UOMName = detail.UOMName;

    result.Quantity = detail.Quantity;
    result.QtyLimit = detail.LimitedQuantity;
    result.QtyDefault = undefined;
    result.IsEnableRegexQty = isEnableQuantityHandling;
    result.IsEnableRegexAttributeValues = false;
    result.IsEnableOrderMultiple = false;
    result.AttributeValues = [];
    result.DescriptionAttributeValues = [];

    if(TDSHelperArray.hasListValue(detail?.AttributeValues)) {
      let listName = detail.AttributeValues.map(x => x.Name);
      let listNameGet = detail.AttributeValues.map(x => x.NameGet);

      result.AttributeValues = listName;
      result.DescriptionAttributeValues = listNameGet;

      result.IsEnableRegexAttributeValues = true;
    }

    return result;
  }

  handleAddWord2s(productConfig: AutoOrderConfig_ProductDTO) {
    let productName = productConfig.ProductNameGet;
    productName =  productName.replace(`[${productConfig.ProductCode}]`,"");
    productName =  productName.trim();

    let result = this.handleWord(productName, productConfig.ProductCode);
    return result;
  }

  handleWord(text: string, code?: string): string[] {
    let result: string[] = [];

    let word = StringHelperV2.removeSpecialCharacters(text);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    result.push(word);

    if(!result.includes(wordNoSignCharacters)) {
      result.push(wordNoSignCharacters);
    }

    if(!result.includes(wordNameNoSpace)) {
      result.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code) {
      result.push(code);
    }

    return result;
  }

  loadConfigLiveCampaign(liveCampaignId: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailAndAttributes(liveCampaignId)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        let users: MDBInnerCreatedByDTO[] = [];

        if(TDSHelperArray.hasListValue(res?.LiveCampaign?.Users)) {
          users = this.prepareUser(res?.LiveCampaign?.Users);
          this.formOrderConfig.controls.IsEnableAutoAssignUser.setValue(true);
        }
        this.formOrderConfig.controls.Users.setValue(users);

        if(TDSHelperArray.hasListValue(res?.Details)) {
          (this.formOrderConfig.controls['TextContentToOrders'] as FormArray).clear();
          this.initTextContentToDetail(res.Details, res.LiveCampaign);
        }

        this.message.info(Message.ConversationPost.LoadConfigSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  onSave() {
    let model = this.prepareModelOrderConfig();

    this.isLoading = true;
    if(this.isCheckValue(model) === 1) {
      this.facebookPostService.updateOrderConfig(this.data.fbid, this.isImmediateApply, model)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.message.success(Message.UpdatedSuccess);
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
  }

  prepareModelOrderConfig() {
    let model = {} as AutoOrderConfigDTO;

    let formValue = this.formOrderConfig.value;

    model.IsEnableOrderAuto = formValue.IsEnableOrderAuto;
    model.IsForceOrderWithAllMessage = formValue.IsForceOrderWithAllMessage;
    model.IsOnlyOrderWithPartner = formValue.IsOnlyOrderWithPartner;
    model.IsOnlyOrderWithPhone = formValue.IsOnlyOrderWithPhone;
    model.IsForceOrderWithPhone = formValue.IsForceOrderWithPhone;
    model.IsForcePrintWithPhone = formValue.IsForcePrintWithPhone;
    // model.MinLengthToVisible = formValue.MinLengthToVisible;
    model.MinLengthToOrder = formValue.MinLengthToOrder;
    model.TextContentToExcludeOrder = formValue.TextContentToExcludeOrder;
    model.TextContentToOrders = formValue.TextContentToOrders;
    model.ExcludedPhones = formValue.ExcludedPhones;
    model.ExcludedStatusNames = formValue.ExcludedStatusNames;
    model.MaxCreateOrder = formValue.MaxCreateOrder;
    model.IsEnableAutoAssignUser = formValue.IsEnableAutoAssignUser;
    model.LiveCampaignId = formValue.LiveCampaignId;
    model.Users = this.prepareUser(formValue.Users);

    if(TDSHelperString.hasValueString(formValue.selectedWord1s)) {
      model.TextContentToExcludeOrder = formValue.selectedWord1s.join(",");
    }

    return model;
  }

  prepareUser(data: any[]) {
    let result: MDBInnerCreatedByDTO[] = data.map((user: ApplicationUserDTO) => {
      let inner = {} as MDBInnerCreatedByDTO;
      inner.Id = user.Id;
      inner.Avatar = user.Avatar;
      inner.Name = user.Name;
      inner.UserName = user.UserName;

      return inner;
    });

    return result;
  }

  isCheckValue(model: AutoOrderConfigDTO): number {
    if(TDSHelperArray.hasListValue(model.TextContentToOrders)) {
      let findIndex = model.TextContentToOrders.findIndex(x => !TDSHelperString.hasValueString(x?.Content));

      if(findIndex >= 0) {
        this.message.error(Message.ConversationPost.TextContentProductEmpty);
        return 0;
      }
    }

    return 1;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    // this.destroy$.next();
    this.destroy$.complete();
  }

}
