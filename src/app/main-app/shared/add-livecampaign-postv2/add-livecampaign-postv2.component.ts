import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { LiveCampaignSimpleDetail } from './../../dto/live-campaign/livecampaign-simple.dto';
import { ProductTemplateService } from './../../services/product-template.service';
import { LiveCampaignDTO } from './../../dto/live-campaign/odata-live-campaign.dto';
import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-add-livecampaign-postv2',
  templateUrl: './add-livecampaign-postv2.component.html',
})

export class AddLivecampaignPostV2Component implements OnInit {

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

  dataModel!: LiveCampaignDTO;
  lstUser: ApplicationUserDTO[] = [];
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstProduct: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  innerTextValue: string = '';
  liveCampainDetails: any = [];

  indClick: number = -1;
  lstVariants:  ProductDTOV2[] = [];
  isLoadingSelect: boolean = false;
  isLoadingNextdata: boolean = false;
  countUOMLine: number = 0;
  pageSize = 20;
  pageIndex = 1;

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

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id) {
        this.loadData(this.id);
    }

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Details: this.fb.array([]),
      Config: [null],
      Name: [null, Validators.required],
      Note: [null],
      ResumeTime: [0],
      StartDate: [new Date()],
      EndDate: [new Date()],
      Users: [null],
      Preliminary_Template: [null],
      ConfirmedOrder_Template: [null],
      MinAmountDeposit: [0],
      MaxAmountDepositRequired: [0],
      IsEnableAuto: [false],
      EnableQuantityHandling: [true],
      IsAssignToUserNotAllowed: [true],
      IsShift: [false],
      Facebook_UserId: [null],
      Facebook_UserName: [null]
    });
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

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;

    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex, this.pageSize, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: ODataProductDTOV2) => {
          this.countUOMLine = res['@odata.count'] as number;
          this.lstProduct = [...res.value];
          this.isLoadingProduct = false;
      },
      error:(err) =>{
          this.isLoadingProduct = false;
          this.message.error(err?.error?.message || 'Không thể tải danh sách sản phẩm');
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
    this.initFormDetails(data.Details);

    this.liveCampainDetails = [...data.Details];
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

  openTag(index: number) {
    this.indClickTag = index;
    //TODO: lấy dữ liệu từ formArray
    let data = this.detailsFormGroups.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
      this.modelTags = data.Tags;
    }else{
      this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(index: number) {
    //TODO: dữ liệu từ formArray
    let details = this.detailsFormGroups.at(index).value;
    details.Tags = this.modelTags;
    //TODO: cập nhật vào formArray
    this.detailsFormGroups.at(index).patchValue(details);
    this.modelTags = [];
    this.indClickTag = -1;
  }

  initFormDetails(details: LiveCampaignProductDTO[]) {
    details?.forEach(x => {
        this.detailsFormGroups.push(this.initDetail(x));
    });
  }

  initDetail(x: LiveCampaignProductDTO | null) {
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

  removeDetail(index: number, detail: TDSSafeAny) {
    this.detailsFormGroups.removeAt(index);
    this.liveCampainDetails = [...this.detailsFormGroups.value];
  }

  removeAllDetail() {
    this.detailsFormGroups.clear();
    this.liveCampainDetails = [];
  }

  createProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            typeComponent: null
        }
    });

    modal.afterClose.subscribe((result: any[]) => {
      if(result && result[0]) {
        this.onReset();
        let x = result[0] as ProductTemplateV2DTO;

        let item = {
            Quantity: 1,
            LiveCampaign_Id: null,
            LimitedQuantity: 0,
            Price: x.ListPrice || 0,
            Note: null,
            ProductId: x.VariantFirstId,
            ProductName: x.Name,
            ProductNameGet: x.NameGet,
            RemainQuantity: 0,
            ScanQuantity: 0,
            Tags: x.Tags || '',
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

  onSearchProduct(event: any) {
    if(!this.textSearchProduct) {
      return;
    }

    this.pageIndex = 1;
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
    this.indClick = -1;
    this.lstVariants = [];
  }

  selectProduct(data: ProductDTOV2, index: number){
    this.indClick = index;
    let uomId: number = data.UOMId;
    this.loadProductAttributeLine(data.ProductTmplId, uomId);
  }

  addItemProduct(listData: ProductDTOV2[], isVariants?: boolean){
    let formDetails = this.detailsFormGroups.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x:ProductDTOV2) => {
      let exist = formDetails.filter((f:LiveCampaignProductDTO) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];

      // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
      if(!exist){
          let qty = Number(this.lstInventory[x.Id]?.QtyAvailable) > 0 ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
          let item = {
              Quantity: qty,
              LiveCampaign_Id: null,
              LimitedQuantity: 0,
              Price: isVariants ? (x.PriceVariant || 0) : (x.Price || 0),
              Note: x.Note || null,
              ProductId: x.Id,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              RemainQuantity: 0,
              ScanQuantity: 0,
              Tags: '',
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              ProductCode: x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
              UsedQuantity: 0
          } as LiveCampaignSimpleDetail;

          let name = item.ProductNameGet || item.ProductName;
          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags);
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

  getAllVariants(){
    let simpleDetail = [...this.lstVariants];
    this.addItemProduct(simpleDetail, true);
    this.closeSearchProduct();
  }

  getCurrentVariant(data: ProductDTOV2){
    let simpleDetail= [data] as ProductDTOV2[];
    this.addItemProduct(simpleDetail)
    this.closeSearchProduct();;
  }

  pushItemToFormArray(items: LiveCampaignProductDTO[], isVariants?: boolean) {
    let formDetails = this.detailsFormGroups.value as any[];
    let countNew = 0;
    let countEdit = 0;

    items.forEach((item: LiveCampaignProductDTO) => {
        let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
        if(Number(index) >= 0) {
            index = Number(index);
            this.detailsFormGroups.at(index).patchValue(item);
            countEdit +=1;

            if(!isVariants){
              this.notificationService.info(`Cập nhật sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm ${item.ProductName}</span><span> Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span></div>`)
            }
        } else {
            formDetails = [...[item], ...formDetails]
            this.detailsFormGroups.clear();
            this.initFormDetails(formDetails);
            countNew +=1;

            if(!isVariants){
              this.notificationService.info(`Thêm sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm ${item.ProductName}</span><span> Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span></div>`)
            }
        }
    })

    if(isVariants) {
      if(countNew > 0) {
        this.notificationService.info(`Thêm sản phẩm`,`Bạn vừa thêm <span class="font-semibold text-secondary-1">${countNew}</span> sản phẩm vào danh sách`);
      }
      if(countEdit > 0) {
          this.notificationService.info(`Cập nhật sản phẩm`,`Bạn vừa cập nhật <span class="font-semibold text-secondary-1">${countEdit}</span> sản phẩm trong danh sách`);
      }
    }

    this.liveCampainDetails = [...this.detailsFormGroups.value];
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

  createLiveCampaign(model: LiveCampaignModel){
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

  trackByIndex(i: any): number {
    return i;
  }

  generateTagDetail(productName: string, code: string, tags: string) {
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

    if(TDSHelperString.hasValueString(code) && code) {
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

  refreshData() {
    this.visible = false;
    this.searchValue = '';
    this.detailsFormGroups.clear();
    this.initFormDetails(this.liveCampainDetails);
  }

  onReset(): void {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    this.detailsFormGroups.clear();
    this.initFormDetails(this.liveCampainDetails);
  }

  onSearch(): void {
    this.liveCampainDetails = [...this.detailsFormGroups.value];

    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  loadProductAttributeLine(id: TDSSafeAny, uomId: number) {
    if(this.isLoadingSelect){
        return;
    }

    this.isLoadingSelect = true;
    this.lstVariants = [];

    this.productTemplateService.getProductVariants(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
            this.lstVariants = [...res.value];
            this.lstVariants?.map((x: ProductDTOV2) => {
                x.UOMId = uomId;
            })

            this.isLoadingSelect = false;
        },
        error: error => {
            this.message.error(error?.error?.message || Message.CanNotLoadData);
            this.isLoadingSelect = false;
        }
      }
    )
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  onOpenSearchvalue(){
    this.liveCampainDetails = [...this.detailsFormGroups.value];
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

  vsEndUOMLine(event: NgxVirtualScrollerDto) {
    if(this.isLoadingProduct || this.isLoadingNextdata) {
        return;
    }

    let exisData = this.lstProduct && this.lstProduct.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
      const vsEnd = Number(this.lstProduct.length - 1) == Number(event.endIndex) && this.pageIndex >= 1 && Number(this.lstProduct.length) < this.countUOMLine;
      if(vsEnd) {
          this.nextDataUOMLine();
      }
    }
  }

  nextDataUOMLine() {
    this.isLoadingNextdata = true;
    this.pageIndex += 1;
    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex, this.pageSize, this.textSearchProduct).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res && res.value) {
            this.lstProduct = [...this.lstProduct, ...res.value];
          }

          this.isLoadingNextdata = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoadingNextdata = false;
        this.message.error(`${error?.error?.message}`);
        this.cdRef.detectChanges();
      }
    })
  }
}
