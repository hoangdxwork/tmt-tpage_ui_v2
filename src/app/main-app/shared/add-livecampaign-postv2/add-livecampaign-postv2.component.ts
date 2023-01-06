import { ODataLiveCampaignService } from './../../services/mock-odata/odata-live-campaign.service';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from './../../dto/live-campaign/livecampaign-simple.dto';
import { ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { LiveCampaignModel, ODataLiveCampaignModelDTO } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, takeUntil, mergeMap, map } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { differenceInCalendarDays } from 'date-fns';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { ProductService } from '@app/services/product.service';
import { LiveCampaignProductDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { StringHelperV2 } from '../helper/string.helper';
import { Message } from '@core/consts/message.const';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from '@app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '@app/services/product-indexdb.service';
import { THelperDataRequest } from '@core/services/helper-data.service';
import { SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { SortEnum } from '@core/enum';

@Component({
  selector: 'app-add-livecampaign-postv2',
  templateUrl: './add-livecampaign-postv2.component.html',
})

export class AddLivecampaignPostV2Component implements OnInit {

  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;
  @Input() id?: string;
  @Input() isCopy?: boolean;

  selectedIndex: number = 0;
  _form!: FormGroup;

  searchValue = '';
  visible = false;

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  dataModel!: LiveCampaignSimpleDto;
  lstUser: ApplicationUserDTO[] = [];
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstProduct: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;

  innerText!: string;
  innerTextDebounce!: string;

  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  innerTextValue: string = '';
  livecampaignSimpleDetail: any = [];

  indClick: number = -1;
  lstVariants:  DataPouchDBDTO[] = [];
  isLoadingSelect: boolean = false;
  isLoadingNextdata: boolean = false;
  countUOMLine: number = 0;
  indexDbStorage!: DataPouchDBDTO[];

  lstOrderTags!: string[];

  isShowEditLimitedQuantity!: boolean;
  limitedQuantityAll: number = 0;

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  }

  parserComas = (value: TDSSafeAny) =>{
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  }

  constructor(private crmTeamService: CRMTeamService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private productIndexDBService: ProductIndexDBService,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private notificationService: TDSNotificationService,
    private productService: ProductService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private prepareHandler: PrepareAddCampaignHandler,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
    private odataLiveCampaignService: ODataLiveCampaignService) {
      this.createForm();
   }

  get detailsForm() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id) {
        this.loadData(this.id);
    } else {
      this.loadCheckIsEnableAuto();
    }

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
    this.productLastV2();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Details: this.fb.array([]),
      Config: [null],
      ConfigObject: [null],// xóa khi lưu
      Name: [null, Validators.required],
      Note: [null],
      ResumeTime: [10],
      StartDate: [new Date()],
      EndDate: [new Date()],
      Users: [null],
      Preliminary_Template: [null],
      Preliminary_TemplateId: [null],
      ConfirmedOrder_Template: [null],
      ConfirmedOrder_TemplateId: [null],
      MinAmountDeposit: [0],
      MaxAmountDepositRequired: [0],
      IsEnableAuto: [false],
      EnableQuantityHandling: [true],
      IsAssignToUserNotAllowed: [true],
      IsShift: [false],
      Facebook_UserId: [null],
      Facebook_UserName: [null]
    });

    this._form.controls['ConfigObject'].patchValue(this.lstConfig[0]);
    this._form.controls['Config'].setValue('Draft');
  }

  loadCheckIsEnableAuto() {
    let params = THelperDataRequest.convertDataRequestToString(1, 1, {} as any, this.sort);

    this.isLoading = true;
    this.odataLiveCampaignService.getView(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ODataLiveCampaignModelDTO) => {
          if(res.value && res.value.length >=0 && res.value[0]?.Id) {

            let liveCampaignId = res.value[0]?.Id;
            this.liveCampaignService.getByLiveCampaignId(liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
              next: res => {
                  if(res.IsEnableAuto) {
                    this._form.controls.IsEnableAuto.setValue(res.IsEnableAuto);
                  }
                  this.isLoading = false;
              },
              error: error => {
                  this.isLoading = false;
              }
            })
          } else {
            this.isLoading = false;
          }
      },
      error: error => {
          this.isLoading = false;
      }
    })
  }

  productLastV2() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            this.indexDbStorage = [...res?.cacheDbStorage || []];
            this.isLoadingProduct = false;
            this.cdRef.detectChanges();
        },
        error:(err) => {
            this.isLoadingProduct = false;
            this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
            this.cdRef.detectChanges();
        }
    })
  }

  onChangeConfirmedOrder_Template(event: any) {
    if(event) {
        this._form.controls['ConfirmedOrder_TemplateId'].setValue(event.Id);
    } else {
        this._form.controls['ConfirmedOrder_TemplateId'].setValue(null);
    }
  }

  onChangePreliminary_Template(event: any) {
    if(event) {
        this._form.controls['Preliminary_TemplateId'].setValue(event.Id);
    } else {
        this._form.controls['Preliminary_TemplateId'].setValue(null);
    }
  }

  onChangeConfig(event: any) {
    if(event) {
        this._form.controls['Config'].setValue(event.value);
    } else {
        this._form.controls['Config'].setValue(null);
    }
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstUser = [...res];
      },
      error: (err: any) => {
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  loadQuickReply() {
    this.quickReplyService.setDataActive();
    this.lstQuickReplies$ = this.quickReplyService.getDataActive();
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

  loadCurrentCompany() {
    this.sharedService.apiCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
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

  loadData(id?: string) {
    if(id) {
      this.isLoading = true;
      this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
              this.isLoading = false;
              delete res['@odata.context'];

              if(res.StartDate) {
                  res.StartDate = new Date(res.StartDate)
              }
              if(res.EndDate) {
                  res.EndDate = new Date(res.EndDate)
              }

              this.dataModel = res;

              if(!res.ConfirmedOrder_TemplateId && res.ConfirmedOrder_Template?.Id) {
                  this.dataModel.ConfirmedOrder_TemplateId = res.ConfirmedOrder_Template?.Id;
              }

              if(!res.Preliminary_TemplateId && res.Preliminary_Template?.Id) {
                  this.dataModel.Preliminary_TemplateId = res.Preliminary_Template?.Id;
              }

              this.updateForm(res);
          },
          error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          }
        });
    }
  }

  updateForm(data: any) {
    // TODO: trường hợp copy chiến dịch live
    if(this.isCopy) {
        data.Details?.map((x: any) => {
            delete x.Id;
        })
    };

    this._form.patchValue(data);

    this._form.controls["Config"].setValue(data.Config);
    let exist = this.lstConfig.filter((x: any) => x.value === data.Config)[0];
    if(exist) {
        this._form.controls['ConfigObject'].patchValue(exist);
    }

    let details = data.Details.sort((a: LiveCampaignSimpleDetail, b: LiveCampaignSimpleDetail) => new Date(b.DateCreated || '').getTime() - new Date(a.DateCreated || '').getTime())
    this.initFormDetails(details);
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
    this.getLstOrderTags(details);
  }

  //TODO: disable các giá trị ngày không khả dụng
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  onChangeDeposit(event:any){
    let maxAmountDepositRequired = this.dataModel? this.dataModel.MaxAmountDepositRequired: this._form.controls["MaxAmountDepositRequired"].value;

    if(event != maxAmountDepositRequired){
        this.isDepositChange = true;
    }else{
        this.isDepositChange = false;
    }

    if(this.isDepositChange) {
      setTimeout(()=>{
          this.isDepositChange = false;
      }, 10 * 1000);
    }
  }

  openTag(item: any) {
    let formDetails = this.detailsForm.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    this.indClickTag = index;
    //TODO: lấy dữ liệu từ formArray
    let data = this.detailsForm.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
      this.modelTags = data.Tags;
    } else {
      this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(item: any) {
    let formDetails = this.detailsForm.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    //TODO: dữ liệu từ formArray
    let details = this.detailsForm.at(index).value;
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.detailsForm.at(index).patchValue(details);
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];

    this.modelTags = [];
    this.indClickTag = -1;
  }

  initFormDetails(details: any[]) {
    details?.forEach(x => {
        this.detailsForm.push(this.initDetail(x));
    });
  }

  initDetail(x: LiveCampaignSimpleDetail | null) {
    let item = this.fb.group({
        Id: [null],
        Index: [null],
        Quantity: [0],
        RemainQuantity: [0],
        ScanQuantity: [0],
        UsedQuantity: [0],
        Price: [null],
        Note: [null],
        ProductId: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [0],
        LiveCampaign_Id: [null],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: [false]
    });

    if(x) {
      item.patchValue(x);
    }

    return item;
  }

  removeDetail(item: LiveCampaignSimpleDetail) {
    let formDetails = this.detailsForm.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
    this.detailsForm.removeAt(index);

    let newFormDetails = this.detailsForm.value as any[];
    this.livecampaignSimpleDetail = [];
    this.detailsForm.clear();

    this.initFormDetails(newFormDetails);
    this.livecampaignSimpleDetail = [...newFormDetails];
    this.getLstOrderTags(this.detailsForm.value);

    this.searchValue = this.innerTextValue;
  }

  removeAllDetail() {
    this.isShowEditLimitedQuantity = false;
    this.modal.error({
      title: 'Xóa sản phẩm',
      content: 'Bạn muốn xóa tất cả sản phẩm?',
      onOk: () => {
          (<FormArray>this._form.get('Details')).clear();
          this.livecampaignSimpleDetail = [];
      },
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  createProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          type: 'liveCampaign',
          lstOrderTags: this.lstOrderTags
        }
    });

    modal.afterClose.subscribe((response: any) => {
      if(!response) return;
      this.mappingProductToLive(response);
    })
  }

  mappingProductToLive(response: any) {
    response = {...response} as SyncCreateProductTemplateDto;
    this.indexDbStorage = [...response.cacheDbStorage];

    if(response.type === 'select' && response.productTmpl) {
        const product = response.productTmpl as ProductTemplateV2DTO;
        let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == product.Id && x.UOMId == product.UOMId && x.Active) as DataPouchDBDTO[];

        if(items && items.length == 0) {
            this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
            return;
        }

        let ids = items.map((x: DataPouchDBDTO) => x.Id);
        this.liveCampaignService.getOrderTagbyIds(ids).pipe(takeUntil(this.destroy$)).subscribe({
          next: (tags: any) => {

              let lstDetails = [] as any[];
              items.map((x: DataPouchDBDTO) => {
                  // TODO: kiểm tra số lượng
                  const qty = product.InitInventory > 0 ? product.InitInventory : 1;
                  x.QtyAvailable = qty;

                  // TODO: kiểm tra mã sp từ api
                  const vTag = tags && tags[x.Id] ? tags[x.Id] : ''; // mã chốt đơn của biến thể

                  // TODO: lọc sp trùng mã code để tạo tags
                  const exist = this.indexDbStorage.filter((f: DataPouchDBDTO) => TDSHelperString.hasValueString(x.DefaultCode) && x.DefaultCode == f.DefaultCode) as any[];
                  let uomName = '';
                  if(exist && exist.length > 1) {
                      uomName = TDSHelperString.stripSpecialChars(x.UOMName.trim().toLocaleLowerCase());
                  }

                  // TODO: nếu có 2 biến thể trở lên thì ko lấy orderTag
                  let orderTag = product.OrderTag;
                  if(items && items.length > 1) {
                      orderTag = '';
                  }

                  let gTags = this.generateTagDetail(x.DefaultCode, vTag, orderTag, uomName);
                  x.Tags = gTags.join(',');

                  let item = {
                      Quantity: x.QtyAvailable || 1,
                      RemainQuantity: 0,
                      ScanQuantity: 0,
                      QuantityCanceled: 0,
                      UsedQuantity: 0,
                      Price: (x.Price || 0),
                      Note: null,
                      ProductId: x.Id,
                      LiveCampaign_Id: this.id,
                      ProductName: x.Name,
                      ProductNameGet: x.NameGet,
                      UOMId: x.UOMId,
                      UOMName: x.UOMName,
                      Tags: x.Tags,
                      LimitedQuantity: 0,
                      ProductCode: x.DefaultCode,
                      ImageUrl: x.ImageUrl,
                      IsActive: true,
                  } as LiveCampaignSimpleDetail;

                  lstDetails.push(item);
              })

              this.addItemProduct(lstDetails);
          },
          error: (error: any) => {
              this.message.error(error?.error?.message);
          }
        })
    }
  }

  apiOrderTagbyIds(model: DataPouchDBDTO[]) {
    let listData = [...(model|| [])];
    let ids = listData.map(x => x.Id);

    this.liveCampaignService.getOrderTagbyIds(ids).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.validateOrderTagbyIds(listData, res);
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    })
  }

  validateOrderTagbyIds(listData: DataPouchDBDTO[], tags: any) {
    listData.map((x: DataPouchDBDTO) => {
        // TODO: kiểm tra số lượng
        const qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id].QtyAvailable) > 0)
           ? Number(this.lstInventory[x.Id].QtyAvailable) : 1;
        x.QtyAvailable = qty;

        // TODO: kiểm tra mã sp từ api
        const vTag = tags && tags[x.Id] ? tags[x.Id] : ''; // mã chốt đơn của biến thể

        // TODO: lọc sp trùng mã code để tạo tags
        const exist = this.indexDbStorage.filter((f: DataPouchDBDTO) => TDSHelperString.hasValueString(x.DefaultCode) &&  x.DefaultCode == f.DefaultCode) as any[];
        let uomName = '';
        if(exist && exist.length > 1) {
            uomName = TDSHelperString.stripSpecialChars(x.UOMName.trim().toLocaleLowerCase());
        }

        const orderTag = '';
        let gTags = this.generateTagDetail(x.DefaultCode, vTag, orderTag, uomName);
        x.Tags = gTags.join(',');
    });

    this.lstVariants = [...listData];
    if(listData && this.lstVariants.length == 1) {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail);
        this.closeFilterIndexDB();
    }
  }

  addItemProduct(listData: DataPouchDBDTO[]) {
    let formDetails = this.detailsForm.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x: DataPouchDBDTO) => {
        let exist = formDetails.filter((f: LiveCampaignSimpleDetail) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];
        // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
        if(!exist){
            let item = {
                Quantity: x.QtyAvailable || 1,
                LiveCampaign_Id: null,
                LimitedQuantity: 0,
                Price: x.Price,
                Note: null,
                ProductId: x.Id,
                ProductName: x.Name,
                ProductNameGet: x.NameGet,
                RemainQuantity: 0,
                ScanQuantity: 0,
                Tags: x.Tags,//mã chốt đơn sp
                UOMId: x.UOMId,
                UOMName: x.UOMName,
                ProductCode: x.DefaultCode,
                ImageUrl: x.ImageUrl,
                IsActive: true,
                UsedQuantity: 0
            } as LiveCampaignSimpleDetail;

            simpleDetail = [...simpleDetail, ...[item]];
        } else {
            exist.Quantity += 1;
            simpleDetail = [...simpleDetail, ...[exist]];
        }
    });

    if(simpleDetail && simpleDetail.length > 0){
        this.pushItemToFormArray(simpleDetail);
    }
  }

  onFilterIndexDB(event: any) {
    if(!this.innerText) {
      this.innerTextDebounce = '';
      return;
    };

    this.innerTextDebounce = TDSHelperString.stripSpecialChars(this.innerText.toLocaleLowerCase().trim());
  }

  closeFilterIndexDB(){
    this.innerText = '';
    this.innerTextDebounce = '';
    this.indClick = -1;
    this.lstVariants = [];
  }

  selectProduct(model: DataPouchDBDTO, index: number){
    if(this.isLoadingSelect) return;
    this.indClick = index;
    let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.ProductTmplId && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

    if(items && items.length == 0) {
      this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
      return;
    }

    this.lstVariants = [...items];
    this.apiOrderTagbyIds(this.lstVariants);
  }

  pushItemToFormArray(items: LiveCampaignProductDTO[]) {
    let formDetails = this.detailsForm.value as any[];

    items.forEach((item: LiveCampaignProductDTO) => {
        let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
        if(Number(index) >= 0) {
            index = Number(index);
            this.detailsForm.at(index).patchValue(item);

            this.notificationService.info(`Cập nhật sản phẩm`,
            `<div class="flex flex-col ">
                <span class="mb-1">Sản phẩm: <span class="font-semibold"> ${item.ProductName}</span></span>
                <span> Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span>
            </div>`);
        } else {
            formDetails = [...[item], ...formDetails]
            this.detailsForm.clear();
            this.initFormDetails(formDetails);

            this.notificationService.info(`Thêm mới sản phẩm`,
            `<div class="flex flex-col">
                <span class="mb-1">Sản phẩm: <span class="font-semibold">[${item.ProductCode}] ${item.ProductName}</span></span>
                <span>Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span>
            </div>`);
        }
    })

    this.livecampaignSimpleDetail = [...this.detailsForm.value];
    this.getLstOrderTags(this.detailsForm.value);
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);

      let resumeTime = model.ResumeTime;
      if(resumeTime > 0 && resumeTime < 10) {
          this.message.error('Thời gian tổng hợp tối thiểu 10 phút');
          return;
      }

      let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
      if(team?.Id && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
          model.Facebook_UserId = team.ChannelId;
          model.Facebook_UserName = team.Name;
      }
      this.createLiveCampaign(model);
    }
  }

  createLiveCampaign(model: LiveCampaignSimpleDto){
    this.isLoading = true;
    this.liveCampaignService.create(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res:LiveCampaignModel) => {
          this.isLoading = false;
          this.message.success('Thêm mới chiến dịch live thành công');
          this.onCannel(res);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    });
  }

  isCheckValue() {
    let formValue = this._form.value;
    let formDetails = this.detailsForm.value as any[];

    if(!TDSHelperString.hasValueString((formValue.Name || '').trim())){
        this.message.error('Vui lòng nhập tên chiến dịch');
        return 0;
    }

    if(formValue.Name.length > 255) {
        this.message.error('Tên chiến dịch live tối đa 255 ký tự');
        return 0;
    }

    if(TDSHelperString.hasValueString((formValue.Note || '').trim()) && formValue.Note.length > 500) {
        this.message.error('Ghi chú tối đa 500 ký tự');
        return 0;
    }

    if(formDetails && formDetails.length > 0) {
      let checkLimitedQuantity = formDetails.findIndex(x=> x.LimitedQuantity == null);
      if(checkLimitedQuantity >= 0) {
        this.message.error('Vui lòng nhập đầy đủ giới hạn trên đơn sản phẩm');
        return 0;
      }

      let checkPrice = formDetails.findIndex(x=> x.Price == null);
      if(checkPrice >= 0) {
        this.message.error('Vui lòng nhập đầy đủ giá bán sản phẩm');
        return 0;
      }
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCannel(data?: any) {
    this.modalRef.destroy(data);
  }

  generateTagDetail(defaultCode: string, vTag: string, orderTag: string, uomName: string) {
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
            if(TDSHelperString.hasValueString(uomName)) {
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
          if(!result.find(y => y == x))
            if(TDSHelperString.hasValueString(uomName)) {
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
        })
    }

    return [...result];
  }
  onChangeIsActive(event: any, item: any) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeQuantity(event: any, item: any) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeLimitedQuantity(event: any, item: any) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangePrice(event: any, item: any) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onReset(): void {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    this.detailsForm.clear();
    this.initFormDetails(this.livecampaignSimpleDetail);
    this.indClick = -1;
  }

  onSearch(): void {
    this.indClick = -1;
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  onOpenSearchvalue(){
    this.visible = true;
  }

  showModalAddQuickReply() {
    let modal = this.modal.create({
        title: 'Thêm mới trả lời nhanh',
        content: ModalAddQuickReplyComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'md',
        componentParams: {
          isSaveSelect: true
        }
    });

    modal.afterClose.subscribe({
      next:(res) => {
        if(res) {
          this.loadQuickReply();
          if(res.type && res.type == 'select') {
            this._form.controls['ConfirmedOrder_Template'].setValue(res.value);
          }
        }
      }
    })
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  getVariant(data?: DataPouchDBDTO) {
    if(data && data.Id) { //chọn hiện tại
        let simpleDetail = [data];

        this.addItemProduct(simpleDetail);
        this.closeFilterIndexDB();
    } else {
        let simpleDetail = [...this.lstVariants];

        this.addItemProduct(simpleDetail);
        this.closeFilterIndexDB();
    }

    this.lstVariants = [];
    this.indClick = -1;
  }

  onChangeResumeTime(event: any) {
    if(this._form.controls?.ResumeTime && this._form.controls?.ResumeTime.value < 10 && this._form.controls?.ResumeTime.value > 0) {
      this.message.error('Thời gian tổng hợp tối thiểu 10 phút');
    }
  }

  onChangeModelTag(event: string[], item: TDSSafeAny) {
    let formDetails = this.detailsForm.value as any[];
    let strs = [...this.checkInputMatch(event)];

    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    if(Number(index) >= 0) {
      let details = this.detailsForm.at(index).value;
      details.Tags = strs?.join(',');

       //TODO: cập nhật vào formArray
      this.detailsForm.at(index).patchValue(details);
      this.modelTags = [...strs];
    }

    this.getLstOrderTags(this.detailsForm.value);

    this.cdRef.detectChanges();
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

  getLstOrderTags(data: LiveCampaignSimpleDetail[]) {
    if(data) {
        data = data.filter(x => x.Tags);
        let getTags = data.map(x => TDSHelperArray.isArray(x.Tags)? x.Tags.join(',') : x.Tags.toLocaleLowerCase().trim());
        let tags = getTags.join(',');

        if(TDSHelperString.hasValueString(tags)) {
            this.lstOrderTags = tags.split(',');
        }
      }
    }

  showEditLimitedQuantity() {
    let formDetails = this.detailsForm.value as any[];

    if(formDetails && formDetails.length > 0) {
        this.isShowEditLimitedQuantity = true;
    } 
    else {
        this.message.error('Chưa có sản phẩm nào trong danh sách');
        this.isShowEditLimitedQuantity = false;
    }
  }

  onPopoverVisibleChangeLimitedQuantity(event: boolean) {
    if(!event) {
        this.limitedQuantityAll = 0;
    }
  }

  onSavePopover() {
    let formDetails = this.detailsForm.value as any[];

    if(formDetails && formDetails.length > 0) {
      formDetails.map(x=> {
        return x.LimitedQuantity = this.limitedQuantityAll;
      })
  
      this.detailsForm.clear();
      this.initFormDetails(formDetails);
    }
  }

  onClosePopover() {
    this.isShowEditLimitedQuantity = false;
  }
}
