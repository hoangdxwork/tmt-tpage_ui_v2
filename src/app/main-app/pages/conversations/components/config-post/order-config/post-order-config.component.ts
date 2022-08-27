import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { ConfigUserDTO } from '../../../../../dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { StringHelperV2 } from './../../../../../shared/helper/string.helper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { DataPouchDBDTO } from "src/app/main-app/dto/product-pouchDB/product-pouchDB.dto";
import { ApplicationUserService } from "src/app/main-app/services/application-user.service";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { ModalListProductComponent } from "../../modal-list-product/modal-list-product.component";
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { AutoOrderConfigDTO, AutoOrderProductDTO, TextContentToOrderDTO } from '@app/dto/configs/post/post-order-config.dto';
import * as XLSX from 'xlsx';

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class PostOrderConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() currentLiveCampaign?:LiveCampaignModel;

  dataModel!: AutoOrderConfigDTO;
  isLoading: boolean = false;

  lstTextContentToExcludeOrder:string[] = [];
  lstTextContentToOrders: TextContentToOrderDTO[] = [];
  prefixMoreTemplate: string = '';
  suffixMoreTemplate: string = '';
  fromMoreTemplate: number = 0;
  toMoreTemplate: number = 1;
  isVisibleRangeGenerate: boolean = false;
  isImmediateApply: boolean = false;

  lstTags$!: Observable<CRMTagDTO[]>;
  lstUser$!: Observable<ConfigUserDTO[]>;

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService,
    private applicationUserService: ApplicationUserService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private liveCampaignService: LiveCampaignService) { }

  ngOnInit(): void {
    if(this.data && this.data.ObjectId) {
        this.loadData(this.data.ObjectId);
    }

    this.loadTag();
    this.loadUser();
  }

  validateData() {
    this.data = null as any;
    this.currentLiveCampaign = null as any;
  }

  loadTag() {
    this.lstTags$ = this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadData(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getOrderConfig(postId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: AutoOrderConfigDTO) => {
        this.dataModel = res;

        this.dataModel.TextContentToOrders = [];
        if(res && res.TextContentToOrders && res.TextContentToOrders.length > 0) {
          res.TextContentToOrders.map(x => {
              this.addContentToOrders(x);
          })
        }

        if(res && res.LiveCampaignId) {
          this.loadLiveCampaignById(res.LiveCampaignId);
        }

        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error('Đã xảy ra lỗi');
      }
    });
  }

  loadLiveCampaignById(id: string) {
    this.liveCampaignService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.currentLiveCampaign = res;
        },
        error: (err) => {
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
      });
  }

  addContentToOrders(x?: TextContentToOrderDTO) {
    if(x) {
        this.dataModel.TextContentToOrders.push(x);
    }
    else {
      let idx = Number(this.setIndexToOrder(this.dataModel.TextContentToOrders));
      let item = {
        Index: idx++,
        Content: null,
        ContentWithAttributes: null,
        IsActive: true,
        Product: null
      } as any;

      this.dataModel.TextContentToOrders.push(item);
    }
  }

  setIndexToOrder(data: TextContentToOrderDTO[]): number {
    let indexs = data?.map(x => x.Index);
    if(indexs && indexs.length > 0)
        return Math.max(...indexs);
    return 0;
  }

  // Khách hàng không thuộc trạng thái
  changeExcludedStatusNames(event: TDSSafeAny[]) {
    //TODO: lấy danh sách trả về list gồm CRMTag và string
    this.dataModel.ExcludedStatusNames = event?.map(x => {
      return x.Name || x as string;
    }) || [];
  }

  //Bình luận không có nội dung
  changeTextContentToExcludeOrder(event:string[]) {
    event.forEach(x => {
      if(x.includes(',')){
          this.message.error('Ký tự không hợp lệ');
          event.pop();
      }
    });

    this.lstTextContentToExcludeOrder = [...event];
  }

  // Danh sách không có số điện thoại seeding
  changeExcludedPhones(event:string[]) {
    this.dataModel.ExcludedPhones = [...event];
  }

  prepareInputMatch(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs.length == 1) {
        pop = datas[0];
    } else {
        pop = datas.splice(-1)[0] as string;
    }

    let match = pop?.match(/[~!@#$%^&*(\\\/\-['`;=+\]),.?":{}|<>_]/g);
    let matchRex = match && match.length > 0;
debugger
    // TODO: check kí tự đặc biệt
    if(matchRex) {
        this.message.warning('Ký tự không hợp lệ');
        return [...strs];
    } else {
        return [...strs];
    }
  }

  selectContent(event: string[], item: TextContentToOrderDTO) {
    let strs = [...this.prepareInputMatch(event)];

    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(idx >= 0) {
      this.dataModel.TextContentToOrders[idx].Content = strs.join(',') || null;
      this.dataModel.TextContentToOrders[idx] = {...this.dataModel.TextContentToOrders[idx]};
    }

    this.cdRef.detectChanges();
  }

  // TODO: cập nhật danh sách thuộc tính sản phẩm
  selectContentWithAttributes(event: string[], item: TextContentToOrderDTO) {
    let strs = [...this.prepareInputMatch(event)];

    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(idx) {
      this.dataModel.TextContentToOrders[idx].ContentWithAttributes = strs.join(',') || null;
      this.dataModel.TextContentToOrders[idx] = {...this.dataModel.TextContentToOrders[idx]};
    }

    this.cdRef.detectChanges();
  }

  enableRegexAttributeValues(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(idx) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableRegexAttributeValues = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }

    this.cdRef.detectChanges();
  }

  enableRegexQty(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(idx) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableRegexQty = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }
  }

  enableOrderMultiple(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(idx) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableOrderMultiple = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }
  }

  changeUsers(event: ConfigUserDTO[]){
    this.dataModel.Users = event;
  }

  changeMoreTemplate() {
    this.isVisibleRangeGenerate = !this.isVisibleRangeGenerate;
  }

  removeItemTemplate(item: TextContentToOrderDTO) {
    let datas = this.dataModel.TextContentToOrders.filter(x => x.Index !== item.Index);
    this.dataModel.TextContentToOrders = [...datas];
  }

  removeAllTemplate() {
    let currentIndex = this.lstTextContentToOrders.length;

    if(currentIndex < 1) {
      this.message.info(Message.EmptyData);
      return;
    }

    this.lstTextContentToOrders = [];
  }

  onCannelMoreTemplate() {
    this.prefixMoreTemplate = '';
    this.suffixMoreTemplate = '';
    this.fromMoreTemplate = 0;
    this.toMoreTemplate = 1;

    this.isVisibleRangeGenerate = false;
  }

  addMoreTemplate() {
    // if(this.fromMoreTemplate > this.toMoreTemplate) {
    //   this.message.error(Message.ConversationPost.ErrorNumberMoreTemplate);
    //   return;
    // }

    // for(let i = this.fromMoreTemplate; i <= this.toMoreTemplate; i++) {
    //   let content = `${this.prefixMoreTemplate}${i}${this.suffixMoreTemplate}`;

    //   this.lstTextContentToOrders.push({
    //     Index: this.indexPush,
    //     Content: content,
    //     IsActive: true,
    //     Product: null
    //   })

    //   this.indexPush += 1;
    // }

    // this.message.info(Message.ConversationPost.AddMoreTemplateSuccess);
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

    if (name == "txt") return "txt"
    else if (name == "xlsx") return "xlsx"

    this.message.error(Message.ConversationPost.FileNotFormat);
    return null;
  }

  showModalListProduct(item: TextContentToOrderDTO) {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams:{
        isPostConfig: true
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: DataPouchDBDTO) =>{
        if(TDSHelperObject.hasValue(res)) {
            this.selectProduct(res, item);
        }
      }
    });
  }

  selectProduct(product: DataPouchDBDTO, item: TextContentToOrderDTO) {

    // this.productService.getAttributeValuesById(product.Id).pipe(takeUntil(this.destroy$)).subscribe({
    //   next:(res) => {

    //     let defaultProductConfig = this.prepareProduct(res);
    //     let content = this.getContentString(defaultProductConfig);
    //     let contentWithAttributes = this.getcontentWithAttributesString(defaultProductConfig);

    //     let obj: TextContentToOrderDTO = {
    //       Product: defaultProductConfig || null,
    //       Content: content,
    //       ContentWithAttributes: contentWithAttributes ? contentWithAttributes : null,
    //       Index: index,
    //       IsActive: true
    //     }

    //     let idx = this.lstTextContentToOrders.findIndex(f=> f.Index == index);

    //     this.lstTextContentToOrders[idx] = {...obj};

    //     this.cdRef.detectChanges();
    //   },
    //   error:(err) => {
    //     this.message.error(err?.error?.message || Message.ConversationPost.CanNotGetProduct);
    //   }
    // });
  }

  getContentString(productConfig: AutoOrderProductDTO) {
    let productName = productConfig.ProductName;

    if(!productName){
      productName = productConfig.ProductNameGet.replace(`[${productConfig.ProductCode}]`,``) || '';
      productName = productConfig.ProductNameGet.trim();
    }

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

  loadConfigLiveCampaign(id: string) {
    this.isLoading = true;

    // this.liveCampaignService.getDetailAndAttributes(liveCampaignId).pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next:(res) => {
    //       let users: ConfigUserDTO[] | null = [];

    //       if(TDSHelperArray.hasListValue(res?.LiveCampaign?.Users)) {
    //         this.dataModel.IsEnableAutoAssignUser = true;
    //       }

    //       this.dataModel.Users = users;

    //       if(TDSHelperArray.hasListValue(res?.Details)) {
    //         let details = res.Details as LiveCampaignProductDTO[];

    //         details.map(x => {
    //           let product:AutoOrderProductDTO = {
    //             ProductId: x.ProductId,
    //             ProductCode: x.ProductCode,
    //             ProductName: x.ProductName,
    //             ProductNameGet: x.ProductNameGet,
    //             Price: x.Price,
    //             UOMId: x.UOMId,
    //             UOMName: x.UOMName,
    //             Quantity: x.Quantity,
    //             QtyLimit: x.LimitedQuantity,
    //             QtyDefault: x.Quantity,
    //             IsEnableRegexQty: false,
    //             IsEnableRegexAttributeValues: false,
    //             IsEnableOrderMultiple: false,
    //             AttributeValues: [],
    //             DescriptionAttributeValues: []
    //           };

    //           let content = this.getContentString(product);
    //           let contentWithAttributes = this.getcontentWithAttributesString(product);
    //           let index = this.indexPush;
    //           this.indexPush += 1;

    //           this.lstTextContentToOrders.push({
    //             Product: product || null,
    //             Content: content,
    //             ContentWithAttributes: contentWithAttributes ? contentWithAttributes : null,
    //             Index: index,
    //             IsActive: true
    //           })
    //         })
    //       }
    //       console.log(this.lstTextContentToOrders)

    //       this.isLoading = false;
    //       this.message.info(Message.ConversationPost.LoadConfigSuccess);

    //       this.cdRef.detectChanges();
    //     },
    //     error:(error) => {
    //       this.isLoading = false;
    //       this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
    //     }
    //   });
  }

  prepareProduct(product: any): AutoOrderProductDTO {
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

    if(product.IsEnableRegexAttributeValues){
      result.IsEnableRegexAttributeValues = product.IsEnableRegexAttributeValues;
    }

    if(product.IsEnableRegexQty){
      result.IsEnableRegexQty = product.IsEnableRegexQty;
    }

    if(product.IsEnableOrderMultiple){
      result.IsEnableOrderMultiple = product.IsEnableOrderMultiple;
    }

    result.AttributeValues = [];
    result.DescriptionAttributeValues = [];

    if(TDSHelperArray.hasListValue(product.AttributeValues)) {
      product.AttributeValues.forEach((x:any) => {
        if(x.Name){
          result.AttributeValues.push(x.Name);
        }

        if(x.NameGet){
          result.DescriptionAttributeValues.push(x.NameGet);
        }
      });

      result.IsEnableRegexAttributeValues = true;
    }

    return result;
  }

  prepareUser(data: ConfigUserDTO[] | null) {
    if(data != null){

      return data.map((user: ConfigUserDTO) => {
        return {
          Id: user.Id,
          Avatar: user.Avatar || '',
          Name: user.Name,
          UserName: user.UserName
        } as ConfigUserDTO
      });
    } else {

      return null;
    }
  }

  prepareModelOrderConfig() {
    let model = {} as AutoOrderConfigDTO;

    model.ExcludedPhones = this.dataModel.ExcludedPhones || [];
    model.ExcludedStatusNames = this.dataModel.ExcludedStatusNames || [];
    model.IsEnableAutoAssignUser = this.dataModel.IsEnableAutoAssignUser;
    model.IsEnableOrderAuto = this.dataModel.IsEnableOrderAuto;
    model.IsForceOrderWithAllMessage = this.dataModel.IsForceOrderWithAllMessage;
    model.IsForceOrderWithPhone = this.dataModel.IsForceOrderWithPhone;
    model.IsForcePrintWithPhone = this.dataModel.IsForcePrintWithPhone;
    model.IsOnlyOrderWithPartner = this.dataModel.IsOnlyOrderWithPartner;
    model.IsOnlyOrderWithPhone = this.dataModel.IsOnlyOrderWithPhone;
    model.LiveCampaignId = this.dataModel.LiveCampaignId;
    model.MaxCreateOrder = this.dataModel.MaxCreateOrder;
    model.MinLengthToOrder = this.dataModel.MinLengthToOrder;
    model.TextContentToExcludeOrder = this.lstTextContentToExcludeOrder.join(",");
    model.Users = this.prepareUser(this.dataModel.Users);

    if(model.Users == null){
      model.IsEnableAutoAssignUser = false;
    }

    model.TextContentToOrders = this.lstTextContentToOrders.map(x => {

      if(TDSHelperArray.isArray(x.Content)){
        x.Content = x.Content.join(",");
      }

      if(TDSHelperArray.isArray(x.ContentWithAttributes)){
        x.ContentWithAttributes = x.ContentWithAttributes.join(",");
      }

      if(!x.Product){
        x.Product = null;
      }

      return x;
    });

    return model;
  }

  onSave() {
    let model = this.prepareModelOrderConfig();
    console.log(model)
    if(this.isCheckValue(model) === 1) {
      this.isLoading = true;

      this.facebookPostService.updateOrderConfig(this.data.ObjectId, this.isImmediateApply, model).pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(res) => {
            this.message.success(Message.UpdatedSuccess);
            this.isLoading = false;

            this.cdRef.detectChanges();
          },
          error:(error) => {
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
            this.isLoading = false;
          }
        });
    }
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
}
