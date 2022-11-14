import { UOM } from './../../../../../dto/product-template/product-tempalte.dto';
import { Guid } from 'guid-typescript';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { ConfigUserDTO } from '../../../../../dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { StringHelperV2 } from './../../../../../shared/helper/string.helper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { ApplicationUserService } from "src/app/main-app/services/application-user.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { ModalListProductComponent } from "../../modal-list-product/modal-list-product.component";
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { AutoOrderConfigDTO, AutoOrderProductDTO, TextContentToOrderDTO } from '@app/dto/configs/post/post-order-config.dto';
import * as XLSX from 'xlsx';
import { TDSNotificationService } from 'tds-ui/notification';
import { ProductService } from '@app/services/product.service';
import { LiveCampainGetWithDetailAttributesDto, LiveCampainGetWithDetailsDto } from '@app/dto/live-campaign/livecampain-detail-attributes.dto';
import { CommonService } from '@app/services/common.service';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { SharedService } from '@app/services/shared.service';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class PostOrderConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;
  currentLiveCampaign?: LiveCampaignModel;

  dataModel!: AutoOrderConfigDTO;
  isLoading: boolean = false;

  prefixMoreTemplate: string = '';
  suffixMoreTemplate: string = '';
  fromMoreTemplate: number = 0;
  toMoreTemplate: number = 1;
  isVisibleRangeGenerate: boolean = false;
  isImmediateApply: boolean = false;
  lstInventory!: GetInventoryDTO;
  companyCurrents: any;
  lstTags: CRMTagDTO[] = []
  lstPartnerStatus: any;
  lstUser$!: Observable<ConfigUserDTO[]>;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private facebookPostService: FacebookPostService,
    private commonService: CommonService,
    private applicationUserService: ApplicationUserService,
    private modalRef: TDSModalRef,
    private productService: ProductService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private sharedService: SharedService,
    private notificationService: TDSNotificationService,
    private liveCampaignService: LiveCampaignService) { }

  ngOnInit(): void {
    if(this.data && this.data.ObjectId) {
        this.loadData(this.data.ObjectId);
        this.loadUser();
        this.loadPartnerStatus();

        this.loadCurrentCompany();
    }
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
          this.companyCurrents = res;
          if(this.companyCurrents.DefaultWarehouseId) {
              this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
          }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstInventory = res;
      },
      error:(err) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  validateData() {
    this.data = null as any;
    this.currentLiveCampaign = null as any;
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.lstPartnerStatus = [...res];
        }
    });
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.lstUser$ = this.applicationUserService.getUserActive();
  }

  loadData(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getOrderConfig(postId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: AutoOrderConfigDTO) => {
          this.dataModel = res;

          if(res.TextContentToOrders && res.TextContentToOrders.length > 0) {
              this.dataModel.TextContentToOrders = [...res.TextContentToOrders];
          } else {
              this.dataModel.TextContentToOrders = [];
          }

          if(res.LiveCampaignId && Guid.isGuid(res.LiveCampaignId)) {
              this.loadLiveCampaignById(res.LiveCampaignId);
          }

          if(this.dataModel.ExcludedStatusNames) {
              let status: any = [];
              this.dataModel.ExcludedStatusNames.map((x: any, i: number): any => {
                  if(x) {
                    let item = {
                        text: x,
                        value: `#${i}`
                    }

                    status.push(item);
                  }
              })

              this.dataModel.ExcludedStatusNames = status;
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

  addContentToOrders() {
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

  setIndexToOrder(data: TextContentToOrderDTO[]): number {
    let indexs = data?.map(x => x.Index);
    if(indexs && indexs.length > 0)
        return Math.max(...indexs) + 1;
    return 1;
  }

  // Khách hàng không thuộc trạng thái
  changeExcludedStatusNames(event: TDSSafeAny[]) {
    if(event) {
       this.dataModel.ExcludedStatusNames = [...event];
    }
  }

  //Bình luận không có nội dung
  changeTextContentToExcludeOrder(event: string[]) {
    let strs = [...this.checkInputMatch2(event)];
    let text = strs?.join(',') || null;

    this.dataModel.TextContentToExcludeOrder = text as any;
  }

  // Danh sách không có số điện thoại seeding
  changeExcludedPhones(event: string[]) {
    this.dataModel.ExcludedPhones = [...event];
  }

  checkInputMatch(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs && strs.length == 0) {
      pop = datas[0];
    } else {
      pop = datas[strs.length - 1];
    }

    let match = pop?.match(/[~!@$%^&*(\\\/\-['`;=+\]),.?":{}|<>_]/g);//có thể thêm #
    let matchRex = match && match.length > 0;

    // TODO: check kí tự đặc biệt
    if(matchRex) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  checkInputMatch2(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs && strs.length == 0) {
      pop = datas[0];
    } else {
      pop = datas[strs.length - 1];
    }

    let match = pop?.match(/,/g);//có thể thêm #
    let matchRex = match && match.length > 0;

    // TODO: check kí tự đặc biệt
    if(matchRex) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  selectContent(event: string[], item: TextContentToOrderDTO) {
    let strs = [...this.checkInputMatch(event)];
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index) as number;

    if(Number(idx) >= 0) {
      this.dataModel.TextContentToOrders[idx].Content = strs.join(',')  || null;
      this.dataModel.TextContentToOrders[idx] = {...this.dataModel.TextContentToOrders[idx]};
    }

    this.cdRef.detectChanges();
  }

  // TODO: cập nhật danh sách thuộc tính sản phẩm
  selectContentWithAttributes(event: string[], item: TextContentToOrderDTO) {
    let strs = [...this.checkInputMatch(event)];
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index) as number;

    if(Number(idx) >= 0) {
      this.dataModel.TextContentToOrders[idx].ContentWithAttributes = strs.join(',') || null;
      this.dataModel.TextContentToOrders[idx] = {...this.dataModel.TextContentToOrders[idx]};
    }

    this.cdRef.detectChanges();
  }

  enableRegexAttributeValues(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index) as number;
    if(Number(idx) >=0 ) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableRegexAttributeValues = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }

    this.cdRef.detectChanges();
  }

  enableRegexQty(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(Number(idx) >=0) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableRegexQty = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }
  }

  enableOrderMultiple(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index) as number;
    if(Number(idx) >= 0) {
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
    if(this.dataModel.TextContentToOrders) {
       this.dataModel.TextContentToOrders = [];
    }
  }

  onCannelMoreTemplate() {
    this.prefixMoreTemplate = '';
    this.suffixMoreTemplate = '';
    this.fromMoreTemplate = 0;
    this.toMoreTemplate = 1;

    this.isVisibleRangeGenerate = false;
  }

  generateRangeTemplates() {
    if(this.fromMoreTemplate > this.toMoreTemplate) {
        this.message.error(Message.ConversationPost.ErrorNumberMoreTemplate);
        return;
    }

    for(let i = this.fromMoreTemplate; i <= this.toMoreTemplate; i++) {
      let idx = Number(this.setIndexToOrder(this.dataModel.TextContentToOrders));
      let content = `${this.prefixMoreTemplate}${i}${this.suffixMoreTemplate}`;

      this.dataModel.TextContentToOrders.push({
        Index: idx++,
        Content: content,
        ContentWithAttributes: null,
        IsActive: true,
        Product: null
      })
    }

    this.dataModel.TextContentToOrders = [...this.dataModel.TextContentToOrders];
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

    if (name == "txt") return "txt"
    else if (name == "xlsx") return "xlsx"

    this.message.error(Message.ConversationPost.FileNotFormat);
    return null;
  }

  showModalListProduct(item: TextContentToOrderDTO | null) {
    if(item) {
      const modal = this.modalService.create({
        title: 'Danh sách sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl',
        bodyStyle: {
          padding: '0px'
        },
        componentParams:{
          isPostConfig: true
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) =>{
          if(TDSHelperObject.hasValue(res)) {
              this.selectProduct(res, item);
          }
        }
      });
    }
  }

  selectProduct(product: any, item: TextContentToOrderDTO) {
    this.isLoading = true;
    this.productService.getAttributeValuesById(product.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {

        let productConfig = {...this.prepareProduct(res)};
        let content = this.getContentString(productConfig);

        // TODO: Attributes
        let name = productConfig.ProductTemplateName;
        let contentWithAttributes = this.getcontentWithAttributesString(name) as string;

        let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
        if(idx >= 0) {
          this.dataModel.TextContentToOrders[idx].Product = productConfig;
          this.dataModel.TextContentToOrders[idx].ContentWithAttributes = contentWithAttributes || null;

          if(item.Content) {
              this.dataModel.TextContentToOrders[idx].Content =`${item.Content},${content.join(',')}`;
          } else {
              this.dataModel.TextContentToOrders[idx].Content = content.join(',') || null;
          }
        }

        this.dataModel.TextContentToOrders[idx] = {...this.dataModel.TextContentToOrders[idx]}
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || Message.ConversationPost.CanNotGetProduct);
      }
    });
  }

  //TODO: chỉ sử dụng khi thêm mẫu sản phẩm
  getContentString(productConfig: AutoOrderProductDTO) {

    let name = productConfig.ProductNameGet || productConfig.ProductTemplateName;
    let code = productConfig.ProductCode;

    return this.handleWord(name, code);
  }

  getcontentWithAttributesString(productName: string, code?: string, tags?: string) {
    let attributeValues = this.handleWord(productName, code);

    if(attributeValues && attributeValues.length > 0) {
        return attributeValues.join(",");
    } else {
        return null;
    }
  }

  handleWord(productName: string, code?: string, tags?: string): string[] {
    const data: string[] = [];

    if(!TDSHelperString.hasValueString(productName)) {
      return data;
    }

    if(code) {
      productName = productName.replace(`[${code}]`, "");
    }

    productName = productName.toLocaleLowerCase().trim();

    let word = StringHelperV2.removeSpecialCharacters(productName);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    data.push(word);

    if(!data.includes(wordNoSignCharacters)) {
      data.push(wordNoSignCharacters);
    }

    if(!data.includes(wordNameNoSpace)) {
      data.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code) {
      data.push(code);
    }

    return [...data];
  }

  loadLiveCampaignById(id: string) {
    this.liveCampaignService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.currentLiveCampaign = {...res};
          this.cdRef.detectChanges();
      }
    })
  }

  loadConfigLiveCampaign(id: string) {
    this.isLoading = true;

    this.liveCampaignService.getDetailAndAttributes(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: LiveCampainGetWithDetailAttributesDto) => {
            this.isLoading = false;

            let details = res.Details?.filter(x => x.IsActive == true) as LiveCampainGetWithDetailsDto[];
            if(details?.length == 0) {
                this.notificationService.info('Tải cấu hình thất bại', 'Chiến dịch không có sản phẩm nào hoạt động');
                this.cdRef.detectChanges();
                return;
            }

            let liveCampaign = res.LiveCampaign || {};
            let users: ConfigUserDTO[] | null = [];

            if(TDSHelperArray.hasListValue(res?.LiveCampaign?.Users)) {
                this.dataModel.IsEnableAutoAssignUser = true;
            }

            this.dataModel.Users = [...users];
            this.dataModel.TextContentToOrders = [];

            details.map((x: LiveCampainGetWithDetailsDto) => {
              let productConfig: AutoOrderProductDTO = {
                  ProductId: x.ProductId,
                  ProductCode: x.ProductCode,
                  ProductName: x.ProductName,
                  ProductTemplateName: x.ProductTemplateName,
                  ProductNameGet: x.ProductNameGet,
                  Price: x.Price,
                  UOMId: x.UOMId,
                  UOMName: x.UOMName,
                  Quantity: x.Quantity,
                  QtyLimit: x.LimitedQuantity,
                  QtyDefault: x.Quantity,
                  IsEnableRegexQty: liveCampaign && liveCampaign.EnableQuantityHandling ? true : false,
                  IsEnableRegexAttributeValues: true,
                  IsEnableOrderMultiple: false,
                  AttributeValues: [],
                  DescriptionAttributeValues: [],
                  Tags: x.Tags
              } as any;

              if(x.AttributeValues && x.AttributeValues.length > 0) {
                  productConfig.DescriptionAttributeValues = x.AttributeValues.map(x => {
                      return `${x.NameGet}`;
                  });

                  productConfig.AttributeValues = x.AttributeValues.map(x => {
                      return `${x.Name}`;
                  })

                  if(productConfig.AttributeValues && productConfig.AttributeValues.length > 0) {
                      productConfig.IsEnableRegexAttributeValues = true;
                  } else {
                      productConfig.IsEnableRegexAttributeValues = false;
                  }
              }

              let content = productConfig.Tags;

              // TODO: Attributes
              let name = productConfig.ProductTemplateName;
              let contentWithAttributes = this.getcontentWithAttributesString(name);
              let idx = Number(this.setIndexToOrder(this.dataModel.TextContentToOrders));

              this.dataModel.TextContentToOrders.push({
                Index: idx++,
                Content: content || null,
                ContentWithAttributes: contentWithAttributes || null,
                IsActive: true,
                Product: productConfig || null
              })
            })

            this.notificationService.success('Tải cấu hình thành công', `Đã đồng bộ sản phẩm từ chiến dịch ${res.LiveCampaign.Name}`);
            this.cdRef.detectChanges();
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
      });
  }

  prepareProduct(model: any) {
    const data = {} as AutoOrderProductDTO;

    data.ProductId = model.Id;
    data.ProductCode = model.DefaultCode || model.Barcode;
    data.ProductName = model.Name;
    data.ProductNameGet = model.NameGet;
    data.ProductTemplateName = model.NameTemplate;
    data.Price = model.LstPrice || model.PriceVariant|| 0;
    data.UOMId = model.UOMId;
    data.UOMName = model.UOMName || model?.UOM?.Name;

    data.Quantity = 1;
    if(this.lstInventory && this.lstInventory[data.ProductId]) {
        data.Quantity =  Number(this.lstInventory[data.ProductId]?.QtyAvailable) > 0 ? Number(this.lstInventory[data.ProductId]?.QtyAvailable) : 1;
    }

    data.QtyLimit = model.LimitedQuantity || 0;
    data.QtyDefault = model.Quantity;

    if(model.IsEnableRegexAttributeValues) {
      data.IsEnableRegexAttributeValues = model.IsEnableRegexAttributeValues;
    }

    if(model.IsEnableRegexQty) {
      data.IsEnableRegexQty = model.IsEnableRegexQty;
    }

    if(model.IsEnableOrderMultiple){
      data.IsEnableOrderMultiple = model.IsEnableOrderMultiple;
    }

    data.DescriptionAttributeValues = [];
    data.AttributeValues = [];

    if(TDSHelperArray.hasListValue(model.AttributeValues)) {
      model.AttributeValues.forEach((x:any) => {
          if(x.Name){
            data.AttributeValues.push(x.Name);
          }

          if(x.NameGet){
            data.DescriptionAttributeValues.push(x.NameGet);
          }
      });

      data.IsEnableRegexAttributeValues = true;
    }

    return {...data};
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
    let model = {} as any;

    let status: any[] = [];
    if( this.dataModel.ExcludedStatusNames) {
      status = this.dataModel.ExcludedStatusNames.map((x: any) => {
          if((x.text || x)) {
              return (x.text || x);
          }
      });
    }

    model.ExcludedPhones = this.dataModel.ExcludedPhones || [];
    model.ExcludedStatusNames = status;
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
    model.TextContentToExcludeOrder = this.dataModel.TextContentToExcludeOrder;
    model.TextContentToOrders = this.dataModel.TextContentToOrders;
    model.IsOrderCreateOnlyOnce = this.dataModel.IsOrderCreateOnlyOnce || false;
    model.Users = this.prepareUser(this.dataModel.Users);

    if(model.Users == null){
      model.IsEnableAutoAssignUser = false;
    }
    return model;
  }

  onSave() {
    let model = this.prepareModelOrderConfig();

    if(this.isCheckValue(model) === 1) {
      this.isLoading = true;
      this.facebookPostService.updateOrderConfig(this.data.ObjectId, this.isImmediateApply, model).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.isLoading = false;

          if(this.isImmediateApply) {
              this.notificationService.success('Cập nhật cấu hình thành công', 'Áp dụng ngay cho những bình luận đã có');
          } else {
              this.message.success('Cập nhật cấu hình thành công');
          }
          this.cdRef.detectChanges();
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message || 'Đã xảy ra lỗi'}`);
        }
      });
    }
  }

  isCheckValue(model: AutoOrderConfigDTO): number {
    if(TDSHelperArray.hasListValue(model.TextContentToOrders)) {
      let findIndex = model.TextContentToOrders.findIndex(x => !TDSHelperString.hasValueString(x?.Content)) as number;

      if(Number(findIndex) >= 0) {
        let product = model.TextContentToOrders[findIndex].Product;
        if(product) {
          this.notificationService.info('Nội dung mẫu còn trống', `${product?.ProductName} dữ liệu không hợp lệ`);
        } else {
          this.message.error('Vui lòng nhập nội dung mẫu đầy đủ');
        }
        return 0;
      }
    }

    return 1;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
