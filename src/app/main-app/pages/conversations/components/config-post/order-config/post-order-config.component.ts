import { ConfigUserDTO } from './../../../../../dto/configs/post/post-order-config-v2.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { StringHelperV2 } from './../../../../../shared/helper/string.helper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { ApplicationUserDTO } from "src/app/main-app/dto/account/application-user.dto";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { DataPouchDBDTO } from "src/app/main-app/dto/product-pouchDB/product-pouchDB.dto";
import { ProductDTO } from "src/app/main-app/dto/product/product.dto";
import { ApplicationUserService } from "src/app/main-app/services/application-user.service";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { ProductService } from "src/app/main-app/services/product.service";
import { ModalListProductComponent } from "../../modal-list-product/modal-list-product.component";
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { PostOrderConfigV2DTO, AutoOrderProductDTO, TextContentToOrderDTO } from '@app/dto/configs/post/post-order-config-v2.dto';
import * as XLSX from 'xlsx';

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class PostOrderConfigComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!: PostOrderConfigV2DTO;
  tags: any[] = [];
  fbid: any;
  isLoading: boolean = false;

  // add more template
  prefixMoreTemplate: string = '';
  suffixMoreTemplate: string = '';
  fromMoreTemplate: number = 0;
  toMoreTemplate: number = 1;
  isVisibleRangeGenerate: boolean = false;
  isImmediateApply: boolean = false;
  indexPush: number = 0;

  lstTags$!: Observable<CRMTagDTO[]>;
  lstUser$!: Observable<ApplicationUserDTO[]>;
  currentLiveCampaign!: any | undefined;

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService,
    private applicationUserService: ApplicationUserService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private productService: ProductService,
    private liveCampaignService: LiveCampaignService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && !changes['data'].firstChange) {
        this.validateData();
        this.data = {...changes['data'].currentValue};
        this.loadData(this.data.ObjectId);
    }
  }

  ngOnInit(): void {
    if(this.data && this.data.ObjectId) {
        this.loadData(this.data.ObjectId);
    }
    this.loadTag();
    this.loadUser();
  }

  validateData() {
    this.data = null as any;
    this.currentLiveCampaign = null;
  }

  loadTag() {
    this.lstTags$ = this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadLiveCampaignById(liveCampaignId: string) {

    if(liveCampaignId) {
      this.liveCampaignService.getById(liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            this.currentLiveCampaign = {...res};

            this.cdRef.markForCheck();
          },
          error: (err) => {
            this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadLiveCampaign);
          }
        });
    }
  }

  loadData(postId: string) {
    this.isLoading = true;

    this.facebookPostService.getOrderConfig(postId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: PostOrderConfigV2DTO) => {
          if(res) {
              this.dataModel = {...res};
              this.setupIndex();

              this.cdRef.markForCheck();
          }

          if(res && res.LiveCampaignId) {
            this.loadLiveCampaignById(res.LiveCampaignId);
          }

          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
        }
      });
  }

  setupIndex(){
    let maxIndex = 0;

    this.dataModel.TextContentToOrders?.forEach(x => {
      if(maxIndex < x.Index) maxIndex = x.Index;
    });

    this.indexPush = maxIndex + 1;
  }

  addContentToOrders(data?: TextContentToOrderDTO) {
    if(!this.dataModel.TextContentToOrders){
      this.dataModel.TextContentToOrders = [];
    }

    if(data){
        this.dataModel.TextContentToOrders.push(data);
    }else{
        this.dataModel.TextContentToOrders.push({
            Index: this.indexPush,
            Content: null,
            ContentWithAttributes: null,
            IsActive: true,
            Product: null
        });
        this.indexPush += 1;
    }
  }

  // Bật tạo đơn tự động?
  changeIsEnableOrderAuto(event: boolean) {
    this.dataModel.IsEnableOrderAuto = event;
  }

  // Tạo tự động với bình luận bất kỳ?
  changeIsForceOrderWithAllMessage(event: boolean) {
    this.dataModel.IsForceOrderWithAllMessage = event;
  }

  // Áp dụng ngay cho những bình luận đã có?
  changeIsImmediateApply(event: boolean) {
    this.isImmediateApply = event;
  }

  // Bình luận của khách đã có thông tin (điện thoại, địa chỉ)
  changeIsOnlyOrderWithPartner(event: boolean) {
    this.dataModel.IsOnlyOrderWithPartner = event;
  }

  // Bình luận có số điện thoại
  changeIsOnlyOrderWithPhone(event: boolean) {
    this.dataModel.IsOnlyOrderWithPhone = event;
  }

  // Ép buộc tạo đơn với số điện thoại
  changeIsForceOrderWithPhone(event: boolean) {
    this.dataModel.IsForceOrderWithPhone = event;
  }

  // Ép buộc in nhiều lần với số điện thoại
  changeIsForcePrintWithPhone(event: boolean) {
    this.dataModel.IsForcePrintWithPhone = event;
  }

  // Bật phân công đơn hàng tự động cho nhân viên?
  changeIsEnableAutoAssignUser(event:boolean) {
    this.dataModel.IsEnableAutoAssignUser = event;
  }

  // Khách hàng không thuộc trạng thái
  changeExcludedStatusNames(event:any[]) {
    this.dataModel.ExcludedStatusNames = event.map(x => {
      return x.Name as string;
    });
  }
  //Bình luận không có nội dung
  changeTextContentToExcludeOrder(event:any[]) {
    this.dataModel.TextContentToExcludeOrder = event.join(",");
  }
  // Danh sách không có số điện thoại seeding
  changeExcludedPhones(event:any[]) {
    this.dataModel.ExcludedPhones = event;
  }

  selectContent(event: string[], index: number) {
    let idx = this.dataModel.TextContentToOrders.findIndex(f=> f.Index == index);
    let lastItem = TDSHelperString.stripSpecialChars(event[event.length - 1].toLowerCase());

    event.forEach((x :any, index: number) => {
      if(TDSHelperString.stripSpecialChars(x.toLowerCase()) == lastItem) {
          if(index < event.length - 1){
            this.message.error('Trùng nội dung');
            event.pop();
          }
      }
    })

    this.dataModel.TextContentToOrders[idx].Content = event.join(",");
    this.cdRef.detectChanges();
  }

  selectContentWithAttributes(event: string[], index: number) {
    let idx = this.dataModel.TextContentToOrders.findIndex(f=> f.Index == index);

    this.dataModel.TextContentToOrders[idx].ContentWithAttributes = event.join(",");
  }

  changeUsers(event: any){
    this.dataModel.Users = event;
  }

  changeMoreTemplate() {
    this.isVisibleRangeGenerate = !this.isVisibleRangeGenerate;
  }

  removeTemplate(index: number) {
    this.dataModel.TextContentToOrders = this.dataModel.TextContentToOrders.filter(f=>f.Index != index);
  }

  removeAllTemplate() {
    let currentIndex = this.dataModel.TextContentToOrders.length;

    if(currentIndex < 1) {
      this.message.info(Message.EmptyData);
      return;
    }

    this.dataModel.TextContentToOrders = [];
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

    for(let i = this.fromMoreTemplate; i <= this.toMoreTemplate; i++) {
      let content = `${this.prefixMoreTemplate}${i}${this.suffixMoreTemplate}`;

      this.dataModel.TextContentToOrders.push({
        Index: this.indexPush,
        Content: content,
        IsActive: true,
        Product: null
      })

      this.indexPush += 1;
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

          let excludedPhonesValue = this.dataModel.ExcludedPhones || [];
          result = [...result, ...excludedPhonesValue];

          this.dataModel.ExcludedPhones = result;
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
      size: 'xl',
      componentParams:{
        isPostConfig: true
      }
    });

    modal.afterClose.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        this.selectProduct(res, index);
      }
    });
  }

  selectProduct(product: DataPouchDBDTO, index: number) {

    this.productService.getAttributeValuesById(product.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {

        let defaultProductConfig = this.prepareProduct(res);
        let content = this.getContentString(defaultProductConfig);
        let contentWithAttributes = this.getcontentWithAttributesString(defaultProductConfig);
  
        let obj: TextContentToOrderDTO = {
          Product: defaultProductConfig || null,
          Content: content,
          ContentWithAttributes: contentWithAttributes,
          Index: index,
          IsActive: true
        }
  
        let idx = this.dataModel.TextContentToOrders.findIndex(f=> f.Index == index);
  
        this.dataModel.TextContentToOrders[idx] = {...obj};

        this.cdRef.detectChanges();
      },
      error:(err) => {
        this.message.error(err?.error?.message || Message.ConversationPost.CanNotGetProduct);
      }
    });
  }

  prepareDefaultProduct(product: ProductDTO): AutoOrderProductDTO {
    let result = {} as AutoOrderProductDTO;

    result.ProductId = product.Id;
    result.ProductCode = product.DefaultCode;
    result.ProductName = product.Name;
    result.ProductNameGet = product.NameGet;
    result.Price = product.LstPrice || 0;
    result.UOMId = product.UOMId;
    result.UOMName = product.UOMName;

    result.Quantity = 0;
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

  getContentString(productConfig: AutoOrderProductDTO) {
    let productName = productConfig.ProductNameGet;

    productName =  productName.replace(`[${productConfig.ProductCode}]`,``);
    productName =  productName.trim();

    return this.handleWord(productName, productConfig.ProductCode);
  }

  getcontentWithAttributesString(productConfig: AutoOrderProductDTO) {
    let attributeValues = productConfig.AttributeValues;

    return attributeValues.join(",");
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

    this.liveCampaignService.getDetailAndAttributes(liveCampaignId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          let users: ConfigUserDTO[] | null = [];
          
          if(TDSHelperArray.hasListValue(res?.LiveCampaign?.Users)) {
            users = this.prepareUser(res?.LiveCampaign?.Users);
            this.dataModel.IsEnableAutoAssignUser = true;
          }
          
          this.dataModel.Users = users;
  
          if(TDSHelperArray.hasListValue(res?.Details)) {
            this.dataModel.TextContentToOrders = [];
          }

          this.isLoading = false;
          this.message.info(Message.ConversationPost.LoadConfigSuccess);

          this.cdRef.markForCheck();
        }, 
        error:(error) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
          
          this.cdRef.markForCheck();
        }
      });
  }

  prepareProduct(product: any, isEnableQuantityHandling?: boolean): AutoOrderProductDTO {
    let result = {} as AutoOrderProductDTO;

    result.ProductId = product.ProductId || product.Id;
    result.ProductCode = product.ProductCode || product.DefaultCode;
    result.ProductName = product.ProductName || product.Name;
    result.ProductNameGet = product.ProductNameGet || product.NameGet;
    result.Price = product.Price || product.LstPrice || 0;
    result.UOMId = product.UOMId;
    result.UOMName = product.UOMName;
    result.Quantity = product.Quantity || 0;
    result.QtyLimit = product.LimitedQuantity || 0;
    result.QtyDefault = product.Quantity;
    result.IsEnableRegexQty = isEnableQuantityHandling || false;
    result.IsEnableRegexAttributeValues = false;
    result.IsEnableOrderMultiple = false;
    result.AttributeValues = [];
    result.DescriptionAttributeValues = [];


    if(product?.AttributeValues && TDSHelperArray.hasListValue(product?.AttributeValues)) {
      let listName = product.AttributeValues.map((x: any) => x.Name);
      let listNameGet = product.AttributeValues.map((x: any) => x.NameGet);

      result.AttributeValues = listName || [];
      result.DescriptionAttributeValues = listNameGet || [];

      result.IsEnableRegexAttributeValues = true;
    }

    return result;
  }

  prepareModelOrderConfig() {
    let model = this.dataModel as PostOrderConfigV2DTO;
    
    model.ExcludedPhones = model.ExcludedPhones || [];
    model.ExcludedStatusNames = model.ExcludedStatusNames || [];
    model.Users = this.prepareUser(model.Users || null);

    if(model.Users == null){
      model.IsEnableAutoAssignUser = false;
    }

    if(TDSHelperArray.hasListValue(model.TextContentToOrders)){

      model.TextContentToOrders.map(x => {
        if(TDSHelperArray.isArray(x.Content)){
          x.Content = x.Content.join(",");
        }

        if(TDSHelperArray.isArray(x.ContentWithAttributes)){
          x.ContentWithAttributes = x.ContentWithAttributes.join(",");
        }

        if(x.Product){
          x.Product = this.prepareProduct(x.Product);
        }else{
          x.Product = null;
        }
        
      });
    }

    return model;
  }

  prepareUser(data: ConfigUserDTO[] | null) {

    if(data != null){
      let result: ConfigUserDTO[] = data?.map((user: ConfigUserDTO) => {

        let inner = {} as ConfigUserDTO;
        
        inner.Id = user.Id;
        inner.Avatar = user.Avatar || '';
        inner.Name = user.Name;
        inner.UserName = user.UserName;
  
        return inner;
      });
  
      return result;
    } else {
      return null;
    }
  }

  onSave() {
    let model = this.prepareModelOrderConfig();
    
    if(this.isCheckValue(model) === 1) {
      this.isLoading = true;

      this.facebookPostService.updateOrderConfig(this.data.ObjectId, this.isImmediateApply, model).pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(res) => {
            this.message.success(Message.UpdatedSuccess);
            this.isLoading = false;

            this.cdRef.markForCheck();
          }, 
          error:(error) => {
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
            this.isLoading = false;

            this.cdRef.markForCheck();
          }
        });
    }
  }

  isCheckValue(model: PostOrderConfigV2DTO): number {
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
}
