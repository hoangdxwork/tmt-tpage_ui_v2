import { ApiContentToOrdersV2Dto, TextContentToOrderV2Dto, ProductTextContentToOrderDto } from './../../../../../dto/live-campaign/content-to-order.dto';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { ConfigUserDTO } from '../../../../../dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
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
import { CommonService } from '@app/services/common.service';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { SharedService } from '@app/services/shared.service';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { DataPouchDBDTO } from '@app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTmlpAttributesDto } from '@app/dto/product-template/product-attribute.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html',
  providers: [TDSDestroyService]
})

export class PostOrderConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;
  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;

  postId!: string;
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
  currentTeam!: CRMTeamDTO | null;
  dataDefault!: AutoOrderConfigDTO;
  setOfCheckData= new Set<object>();

  innerTextValue: string = '';
  searchValue: string = '';

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
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
    private crmTeamService: CRMTeamService,
    private modalService: TDSModalService,
    private sharedService: SharedService,
    private notificationService: TDSNotificationService,
    private liveCampaignService: LiveCampaignService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadUser();
    this.loadPartnerStatus();
    this.loadCurrentCompany();
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
          this.companyCurrents = res;
          if(this.companyCurrents?.DefaultWarehouseId) {
              this.loadInventoryWarehouseId(this.companyCurrents?.DefaultWarehouseId);
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
    this.commonService.setPartnerStatus();
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.lstPartnerStatus = [...res];
        },
        error: error =>{
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
    });
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.lstUser$ = this.applicationUserService.getUserActive();
  }

  loadData() {
    this.postId = this.data?.ObjectId;
    this.currentTeam = this.crmTeamService.getCurrentTeam();

    if(!this.postId || !this.currentTeam) return;
    this.isLoading = true;

    this.facebookPostService.getOrderConfig(this.currentTeam?.Id, this.postId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: AutoOrderConfigDTO) => {
          this.dataModel = {...res};
          this.setDataDefault(res);

          this.dataModel.TextContentToOrders = [];
          if(res.TextContentToOrders && res.TextContentToOrders.length > 0) {
              this.dataModel.TextContentToOrders = [...res.TextContentToOrders];
          }

          if(res.LiveCampaignId) {
            this.dataModel.IsEnableOrderAuto = true;
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
          this.message.error( err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  addContentToOrders() {
    let exist = this.dataModel.TextContentToOrders.find(x => x.Product == null);
    if(exist) {
        this.message.error('Vui lòng hoàn thiện mẫu trống trước khi thêm mới');
        return;
    }

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
    if(matchRex || (TDSHelperString.isString(pop) && !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim()))) {
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
    if(Number(idx) >= 0 ) {
      this.dataModel.TextContentToOrders[idx].Product!.IsEnableRegexAttributeValues = event;
      this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
    }

    this.cdRef.detectChanges();
  }

  enableRegexQty(event: boolean, item: TextContentToOrderDTO){
    let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index);
    if(Number(idx) >=0) {
      this.dataModel.TextContentToOrders[idx]!.Product!.IsEnableRegexQty = event;
      this.dataModel.TextContentToOrders[idx]!.Product = {...this.dataModel.TextContentToOrders[idx]!.Product} as any;
    }
  }

  // enableOrderMultiple(event: boolean, item: TextContentToOrderDTO){
  //   let idx = this.dataModel.TextContentToOrders.findIndex(x => x.Index == item.Index) as number;
  //   if(Number(idx) >= 0) {
  //     this.dataModel.TextContentToOrders[idx].Product!.IsEnableOrderMultiple = event;
  //     this.dataModel.TextContentToOrders[idx].Product = {...this.dataModel.TextContentToOrders[idx].Product} as any;
  //   }
  // }

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

    let range = Number(this.toMoreTemplate) - Number(this.fromMoreTemplate);
    if(range > 1000) {
      this.message.error('Chỉ cho phép tạo tối đa 1000 mẫu');
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

    switch (typeFile) {
      case 'txt':
          reader.onload = (e: any) => {
            const binaryStr: string = e.target.result;

            if(!TDSHelperString.hasValueString(binaryStr)) {
              this.message.error('Không tìm thấy dữ liệu trong file');
              return;
            }

            if(!binaryStr.includes(',') && (binaryStr || '').trim().length > 10) {
              this.message.error('Dữ liệu không đúng định dạng');
              return;
            }

            let data = binaryStr?.split(',');
            data = this.onCheckExcludedPhones(data);

            let excludedPhonesValue = this.dataModel.ExcludedPhones || [];
            this.dataModel.ExcludedPhones = [...data, ...excludedPhonesValue];
            event.target.value = null;

            this.cdRef.detectChanges();
            return;
        }
        break;

      case 'xlsx':
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

            if (typeFile == 'xlsx') {
              result.unshift(name_col[0]).toString();
            }

            result = this.onCheckExcludedPhones(result);

            let excludedPhonesValue = this.dataModel.ExcludedPhones || [];
            result = [...result, ...excludedPhonesValue];

            this.dataModel.ExcludedPhones = result;
            event.target.value = null;

            break;
          }
      };
        break;

      default:
        break;
    }
  }

  onCheckExcludedPhones(data: string[]) {
    let result: string[] = [];
    data = data.filter(x=> TDSHelperString.hasValueString((x || '').trim()));
    data = data.map(x=> { return x.trim() });

    data.map(x=> {
      if(!this.dataModel.ExcludedPhones || this.dataModel.ExcludedPhones?.length == 0) {
        result = [...data];
      } else {
        let index = this.dataModel.ExcludedPhones.findIndex(y=> x == y);
          if(Number(index) < 0) {
            result = [...result, ...[x]];
          }
      }
    })

    if(result.length != data.length) {
      this.message.info('Đã loại bỏ số điện thoại trùng vừa thêm vào trong danh sách');
    }

    return result;
  }

  isCheckFile(fileName: string) {
    let arr = fileName.split(".");
    let name = arr[arr.length - 1];

    if (name == "txt") return "txt"
    else if (name == "xlsx") return "xlsx"

    this.message.error(Message.ConversationPost.FileNotFormat);
    return null;
  }

  showModalListProduct(index: number) {
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
        next: (res: any) => {
          if(TDSHelperObject.hasValue(res)) {
              this.selectProduct(res, index);
          }
        }
      });
  }

  selectProduct(x: DataPouchDBDTO, index: number) {
    this.isLoading = true;
    this.productService.getAttributeValuesByIdV2(x.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          delete res['@odata.context'];
          const product = {...res} as ProductTmlpAttributesDto;
          let item = {...this.prepareProduct(product, index)} as TextContentToOrderDTO;

          let content = this.generateTagDetail(product.DefaultCode, product.OrderTag, null, null);
          let contentRange = this.dataModel.TextContentToOrders[index]!.Content;
          if(contentRange) {
              contentRange = contentRange.split(',');
              content = [...contentRange, ...content];
          }
          item.Content = content?.join(',');

          let productTmpl = product.ProductTmpl;
          if(product.AttributeValues && product.AttributeValues.length > 0 && productTmpl) {
              let attribute = this.generateTagDetail(productTmpl.DefaultCode, productTmpl.OrderTag, null, null);
              item.ContentWithAttributes = attribute?.join(',');
          }

          let findIndex = this.dataModel.TextContentToOrders.findIndex(x => x.Product &&
              x.Product?.ProductId == item.Product?.ProductId && x.Product?.UOMId == item.Product?.UOMId);

          if(findIndex >= 0) {
              this.message.info('Sản phẩm này đã tồn tại trong cấu hình');
          } else {
              this.dataModel.TextContentToOrders[index] = {...item};
          }

          this.dataModel.TextContentToOrders = [...this.dataModel.TextContentToOrders];
          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
          this.cdRef.detectChanges();
      }
    });
  }

  generateTagDetail(defaultCode: string, vTag: any, orderTag: any, uomName: any) {
    let result: string[] = [];

    if(TDSHelperString.hasValueString(defaultCode)) {
        defaultCode = defaultCode.toLocaleLowerCase();

        if(TDSHelperString.hasValueString(uomName)) {
            let x = `${defaultCode} ${uomName}`
            result.push(x);
        } else {
            result.push(defaultCode);
        }
    }

    if(vTag) {
        let tagArr1 = vTag.split(',');
        tagArr1?.map((x: any) => {
          if(!result.find(y => y == x)) {
            x = x.toLocaleLowerCase();

            if(TDSHelperString.hasValueString(uomName)) {
                uomName = uomName.toLocaleLowerCase();
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
          }
        })
    }

    if(orderTag) {
        let tagArr2 = orderTag.split(',');
        tagArr2?.map((x: any) => {
          if(!result.find(y => y == x)) {
              x = x.toLocaleLowerCase();
              if(TDSHelperString.hasValueString(uomName)) {
                  uomName = uomName.toLocaleLowerCase();
                  let a = `${x} ${uomName}`;
                  result.push(a);
              } else {
                  result.push(x);
              }
          }
        })
    }

    return [...result];
  }

  loadLiveCampaignById(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.currentLiveCampaign = {...res};

          let exist = this.dataModel && this.dataModel.TextContentToOrders?.length == 0 && this.dataModel.IsEnableOrderAuto && this.currentLiveCampaign?.Id;
          if(exist) {
            let id = this.currentLiveCampaign?.Id as string;
            this.loadConfigLiveCampaignV2(id);
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
        this.cdRef.detectChanges();
      }
    })
  }

  changeIsEnableOrderAuto(event: boolean) {
    let exist = event == true && this.dataModel && this.dataModel.TextContentToOrders
    && this.dataModel.TextContentToOrders.length == 0 && this.currentLiveCampaign?.Id;
    if(exist) {
        let id = this.currentLiveCampaign?.Id as string;
        this.loadConfigLiveCampaignV2(id);
    }
  }

  loadConfigLiveCampaignV2(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getContentToOrders(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          let model = {...res} as ApiContentToOrdersV2Dto;
          model.TextContentToOrders = [...res.TextContentToOrders];
          model.Users = [...res.Users];

          if(model.TextContentToOrders && model.TextContentToOrders.length == 0) {
              this.message.error('Không tìm thấy sản phẩm nào');
              this.isLoading = false;
              this.cdRef.detectChanges();
              return;
          }

          this.dataModel.Users = [];
          if(model.Users && model.Users.length > 0) {
              this.dataModel.IsEnableAutoAssignUser = true;
              this.dataModel!.Users = [...model.Users];
          }

          this.dataModel.TextContentToOrders = [];
          model.TextContentToOrders?.map((x: TextContentToOrderV2Dto) => {
              let item = {...x} as TextContentToOrderDTO;
              this.dataModel.TextContentToOrders.push(item);
          });

          this.isLoading = false;
          this.notificationService.success('Tải cấu hình thành công', `Đã đồng bộ sản phẩm từ chiến dịch ${res.LiveCampaignName}`);
          this.cdRef.detectChanges();
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  prepareProduct(model: ProductTmlpAttributesDto, line?: number) {
    let indexs = this.dataModel.TextContentToOrders.map(x => x.Index);
    let item = {
        Index: Number(Math.max(...indexs)),
        IsActive: true,
        Content: '',
        ContentWithAttributes: '',
        Product: null
    } as TextContentToOrderDTO;

    if(line && line >= 0) {
        item.Index = line;
    }

    let productModel = {
        ProductId: model.Id,
        ProductCode: model.DefaultCode,
        ProductName: model.NameGet,
        ProductNameGet: model.NameGet,
        Price: Number(model.ListPrice) || Number(model.Price) | 0,
        UOMId: model.UOMId,
        UOMName: model.UOMName,
        Quantity: 1,
        QtyLimit: 0,
        QtyDefault: 0,
        IsEnableRegexQty: false,
        IsEnableRegexAttributeValues: true,
        IsEnableOrderMultiple: false,
        AttributeValues: [],
        DescriptionAttributeValues: []
    } as ProductTextContentToOrderDto;

    if(this.lstInventory && productModel && this.lstInventory[model.Id]) {
        productModel.Quantity =  Number(this.lstInventory[model.Id]?.QtyAvailable) > 0 ? Number(this.lstInventory[model.Id]?.QtyAvailable) : 1;
    }

    if(model.AttributeValues && model.AttributeValues.length > 0) {
        model.AttributeValues.map((x: any) => {
            if(x && x.Name) {
                productModel.AttributeValues.push(x.Name);
            }
            if(x && x.NameGet) {
                productModel.DescriptionAttributeValues.push(x.NameGet);
            }
        })
    }

    item.Product = {...productModel};
    return {...item};
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
    this.currentTeam = this.crmTeamService.getCurrentTeam();

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
    model.TeamId = this.currentTeam?.Id;

    if(model.Users == null){
      model.IsEnableAutoAssignUser = false;
    }
    return model;
  }

  onSave() {
    if(!this.postId) {
      this.message.error('Cập nhật thất bại');
      return;
    }

    let model = this.prepareModelOrderConfig();

    if(this.isCheckValue(model) === 1) {
      this.isLoading = true;
      this.facebookPostService.onChangeDisable$.emit(true);
      
      this.facebookPostService.updateOrderConfig(this.data.ObjectId, this.isImmediateApply, model).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.isLoading = false;

          if(this.isImmediateApply) {
              this.notificationService.success('Cập nhật cấu hình thành công', 'Áp dụng ngay cho những bình luận đã có');
          } else {
              this.message.success('Cập nhật cấu hình thành công');
          }
          let data = this.setData(this.dataModel);
          this.setDataDefault(data);
          this.facebookPostService.onChangeDisable$.emit(false);
          
          this.cdRef.detectChanges();
        },
        error:(error) => {
            this.isLoading = false;
            this.facebookPostService.onChangeDisable$.emit(false);
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
            this.notificationService.info('Mã chốt đơn không hợp lệ', `${product?.ProductName} dữ liệu không hợp lệ`, { duration: 3000});
        } else {
            this.message.error('Vui lòng nhập nội dung mẫu đầy đủ');
        }
        return 0;
      }
    }

    return 1;
  }

  onCannel() {
    if(!this.prepareCheckDrity()) {
      this.modalService.info({
        title: 'Thông báo',
        content: 'Cấu hình chốt đơn đã thay đổi nhưng chưa được lưu, bạn có muốn lưu không?',
        onOk: () => {
          this.onSave();
        },
        onCancel:()=>{
          this.modalRef.destroy(null);
        },
        okText:"Lưu",
        cancelText:"Đóng",
        confirmViewType: "compact",
      });
    } else {
      this.modalRef.destroy(null);
    }
  }

  setData(data: AutoOrderConfigDTO) {
    let model = {...data} as AutoOrderConfigDTO;
    return model;
  }

  setDataDefault(data: AutoOrderConfigDTO) {
    this.dataDefault = data;

    if(data.TextContentToOrders && data.TextContentToOrders.length > 0) {
      this.dataDefault.TextContentToOrders = data.TextContentToOrders;
    }

    this.setOfCheckData = new Set<object>();
    this.dataDefault.TextContentToOrders.map(x=> {
      this.setOfCheckData.add(x);
    })
  }

  onCheckSelectChange(){
    if(!this.prepareCheckDrity()) {
      this.modalService.info({
        title: 'Thông báo',
        content: 'Cấu hình chốt đơn đã thay đổi nhưng chưa được lưu, bạn có muốn lưu không?',
        onOk: () => {
          this.onSave();
        },
        onCancel:()=>{
          // this.dataModel = this.setData(this.dataDefault);
        },
        okText:"Lưu",
        cancelText:"Bỏ qua",
        confirmViewType: "compact",
      });
    }
  }

  prepareCheckDrity() {
    if(!this.dataDefault || !this.dataModel) return true;
    if(this.dataDefault.IsEnableOrderAuto != this.dataModel.IsEnableOrderAuto) return false;
    if(this.dataDefault.IsForceOrderWithAllMessage != this.dataModel.IsForceOrderWithAllMessage) return false;
    if(this.dataDefault.IsOnlyOrderWithPartner != this.dataModel.IsOnlyOrderWithPartner) return false;
    if(this.dataDefault.IsOnlyOrderWithPhone != this.dataModel.IsOnlyOrderWithPhone) return false;
    if(this.dataDefault.IsForceOrderWithPhone != this.dataModel.IsForceOrderWithPhone) return false;
    if(this.dataDefault.IsForcePrintWithPhone != this.dataModel.IsForcePrintWithPhone) return false;
    if(this.dataDefault.MinLengthToOrder != this.dataModel.MinLengthToOrder) return false;
    if(this.dataDefault.MaxCreateOrder != this.dataModel.MaxCreateOrder) return false;
    if(this.dataDefault.TextContentToExcludeOrder != this.dataModel.TextContentToExcludeOrder) return false;
    if(this.dataDefault.ExcludedPhones != this.dataModel.ExcludedPhones) return false;
    if(this.dataDefault.IsEnableAutoAssignUser != this.dataModel.IsEnableAutoAssignUser) return false;
    if(this.dataDefault.Users != this.dataModel.Users) return false;
    if(this.dataDefault.IsEnableOrderReplyAuto != this.dataModel.IsEnableOrderReplyAuto) return false;
    if(this.dataDefault.IsEnableOrderReplyAuto != this.dataModel.IsEnableOrderReplyAuto) return false;
    if(this.dataDefault.OrderReplyTemplate != this.dataModel.OrderReplyTemplate) return false;
    if(this.dataDefault.IsEnableShopLink != this.dataModel.IsEnableShopLink) return false;
    if(this.dataDefault.IsOrderAutoReplyOnlyOnce != this.dataModel.IsOrderAutoReplyOnlyOnce) return false;
    if(this.dataDefault.IsOrderCreateOnlyOnce != this.dataModel.IsOrderCreateOnlyOnce) return false;
    if(this.dataDefault.TextContentToOrders?.length != this.dataModel.TextContentToOrders?.length) return false;
    if(!this.checkTextContentToOrders()) return false;

    return true;
  }

  checkTextContentToOrders() {
    this.setOfCheckData
    let exist = true;
    this.dataModel.TextContentToOrders.map(x=> {
      if(!this.setOfCheckData.has(x)) {
        exist = false;
      }
    })
    return exist;
  }

  onSearchProduct(){
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  trackByIndex(_: number, data: any): number {
    return data.Index;
  }
}
