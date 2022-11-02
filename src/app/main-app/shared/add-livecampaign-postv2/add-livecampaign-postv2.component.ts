import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from './../../dto/live-campaign/livecampaign-simple.dto';
import { ProductTemplateService } from './../../services/product-template.service';
import { LiveCampaignDTO } from './../../dto/live-campaign/odata-live-campaign.dto';
import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
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
import { ProductIndexDBService } from '@app/services/product-indexDB.service';

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
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private productService: ProductService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private prepareHandler: PrepareAddCampaignHandler,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
    private productTemplateService: ProductTemplateService) {
      this.createForm();
   }

  get detailsForm() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id) {
        this.loadData(this.id);
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
      ResumeTime: [0],
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

  productLastV2() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            if(!res) return;
            this.indexDbStorage = [...res?.cacheDbStorage];
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

    this.initFormDetails(data.Details);
    this.livecampaignSimpleDetail = [...data.Details];
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

    this.searchValue = this.innerTextValue;
  }

  removeAllDetail() {
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
        viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe((res: any) => {

      if(!res) return;
      res = {...res} as SyncCreateProductTemplateDto;
      this.indexDbStorage = [...res.cacheDbStorage];

      if(res.type === 'select' && res.productTmpl) {
        const product = res.productTmpl as ProductTemplateV2DTO;
        let items = this.indexDbStorage.filter(y => y.Id == product.VariantFirstId && y.UOMId == product.UOMId && y.Active) as any[];

        if(items && items.length == 0) {
          this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
          return;
        }

        let x =  items[0];
        let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id].QtyAvailable)) > 0
          ? Number(this.lstInventory[x.Id].QtyAvailable) : 1;

        let item = {
            Quantity: qty,
            LiveCampaign_Id: null,
            LimitedQuantity: 0,
            Price: x.ListPrice || 0,
            Note: null,
            ProductId: x.VariantFirstId,
            ProductName: x.Name,
            ProductNameGet: x.NameGet,
            RemainQuantity: 0,
            ScanQuantity: 0,

            Tags: product.OrderTag,

            UOMId: x.UOMId,
            UOMName: x.UOMName,
            ProductCode: x.DefaultCode,
            ImageUrl: x.ImageUrl,
            IsActive: x.Active,
            UsedQuantity: 0,
        } as LiveCampaignProductDTO;

        let name = item.ProductNameGet || item.ProductName;
        let tags = this.generateTagDetail(name, item.ProductCode, item.Tags);
        item.Tags = tags.join(',');

        this.pushItemToFormArray([item]);
      }
    })
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

    items.map((x: DataPouchDBDTO) => {
      x._attributes_length = 0;

      let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
        ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
      x.QtyAvailable =qty;
    });

    this.lstVariants = [...items];
    if(this.lstVariants && this.lstVariants.length == 1) {
      let simpleDetail = [...this.lstVariants];
      this.addItemProduct(simpleDetail)
      this.closeFilterIndexDB();
    }
  }

  addItemProduct(listData: DataPouchDBDTO[], isVariants?: boolean){
    let formDetails = this.detailsForm.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x:DataPouchDBDTO) => {
      let exist = formDetails.filter((f:LiveCampaignProductDTO) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];

      // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
      if(!exist){
          let qty = this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0
            ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
          let item = {
              Quantity: qty,
              LiveCampaign_Id: null,
              LimitedQuantity: 0,
              Price: x.Price || 0,
              Note: null,
              ProductId: x.Id,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              RemainQuantity: 0,
              ScanQuantity: 0,
              Tags: x.Tags,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              ProductCode: x.Barcode || x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
              UsedQuantity: 0
          } as LiveCampaignSimpleDetail;

          let name = item.ProductNameGet || item.ProductName;
          if(x._attributes_length == undefined) x._attributes_length = 0;

          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags, x._attributes_length);
          item.Tags = tags?.join(',');

          simpleDetail = [...simpleDetail, ...[item]];
      } else {
          exist.Quantity += 1;
          simpleDetail = [...simpleDetail, ...[exist]];
      }
    })

    if(simpleDetail && simpleDetail.length > 0){
        this.pushItemToFormArray(simpleDetail, isVariants)
    }
  }

  pushItemToFormArray(items: LiveCampaignProductDTO[], isVariants?: boolean) {
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
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);

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

    if(!TDSHelperString.hasValueString(formValue.Name)){
        this.message.error('Vui lòng nhập tên chiến dịch');
        return 0;
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCannel(data?: any) {
    this.modalRef.destroy(data);
  }

  generateTagDetail(productName: string, code: string, tags: string, _attributes_length?: number) {
    let result: string[] = [];

    if(!TDSHelperString.hasValueString(productName)) {
      return result;
    }

    productName = productName.replace(`[${code}]`, "");
    productName = productName.trim();

    let word = StringHelperV2.removeSpecialCharacters(productName);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    result.push(word);

    if(!result.includes(wordNoSignCharacters)) {
      result.push(wordNoSignCharacters);
    }

    if(!result.includes(wordNameNoSpace)) {
      result.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code  && _attributes_length == 0) {
      result.push(code);
    }

    if(TDSHelperString.hasValueString(tags)){
        let tagArr = tags.split(',');
        tagArr.map(x => {
          if(!result.find(y=> y == x))
              result.push(x);
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
        size: 'md'
    });

    modal.afterClose.subscribe({
      next:(res) => {
        if(res) {
          this.loadQuickReply();
        }
      }
    })
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  getVariant(data?: DataPouchDBDTO) {
    if(data && data.Id) {//chọn hiện tại
        let simpleDetail = [data];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    } else {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    }

    this.lstVariants = [];
    this.indClick = -1;
  }

  onChangeResumeTime(event: any) {
    if(this._form.controls?.ResumeTime && this._form.controls?.ResumeTime.value < 10 && this._form.controls?.ResumeTime.value > 0) {
      this.message.error('Thời gian tổng hợp tối thiểu 10 phút');
      this._form.controls['ResumeTime'].setValue(0);
    }
  }
}
