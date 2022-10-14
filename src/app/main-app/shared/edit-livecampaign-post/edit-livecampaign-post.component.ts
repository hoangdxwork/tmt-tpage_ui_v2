import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { ProductTemplateService } from '../../services/product-template.service';
import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { differenceInCalendarDays } from 'date-fns';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { ProductService } from '@app/services/product.service';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { StringHelperV2 } from '../helper/string.helper';
import { Message } from '@core/consts/message.const';
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';

@Component({
  selector: 'edit-livecampaign-post',
  templateUrl: './edit-livecampaign-post.component.html',
  providers: [TDSDestroyService]
})

export class EditLiveCampaignPostComponent implements OnInit {

  _form!: FormGroup;
  @Input() id?: string;

  selectedIndex: number = 0;
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
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  isEditDetails: { [id: string] : boolean } = {};
  livecampaignSimpleDetail: any = [];
  innerTextValue: string = '';

  indClick: number = -1;
  lstVariants:  ProductDTOV2[] = [];
  isLoadingSelect: boolean = false;
  countUOMLine: number = 0;
  pageSize = 20;
  pageIndex = 1;
  isLoadingNextdata: boolean = false;

  numberWithCommas =(value:TDSSafeAny) =>{
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
    private cdRef: ChangeDetectorRef,
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
    private productTemplateService: ProductTemplateService) {
      this.createForm();
  }

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id) {
        this.loadData();
    }

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [this.id],
      Details: this.fb.array([]),
      Config: [null],
      Name: [null, Validators.required],
      Note: [null],
      ResumeTime: [0],
      StartDate: [null],
      EndDate: [null],
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
        if(res && TDSHelperArray.isArray(res)) {
          this.lstUser = [...res];
        }
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
          this.cdRef.detectChanges();
      },
      error:(err) =>{
          this.isLoadingProduct = false;
          this.message.error(err?.error?.message || 'Không thể tải danh sách sản phẩm');
          this.cdRef.detectChanges();
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

  loadData() {
    let id = this.id as string;
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          delete res['@odata.context'];

          if(res.StartDate) {
            res.StartDate = new Date(res.StartDate)
          }
          if(res.EndDate) {
              res.EndDate = new Date(res.EndDate)
          }

          this.dataModel = res;
          this.updateForm(res);
          this.isLoading = false;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  updateForm(data: any) {
    this._form.patchValue(data);
    this._form.controls['Id'].setValue(this.id);

    this.initFormDetails(data.Details);
    this.livecampaignSimpleDetail = [...this.detailsFormGroups.value];
  }

  //TODO: disable các giá trị ngày không khả dụng
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  onChangeDeposit(event:any) {
    let maxAmountDepositRequired = this.dataModel ? this.dataModel.MaxAmountDepositRequired : this._form.controls["MaxAmountDepositRequired"].value;

    if(event != maxAmountDepositRequired){
        this.isDepositChange = true;
    } else {
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
    let data = this.detailsFormGroups.at(index).value;

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

  onSaveTag(index: number) {
    //TODO: dữ liệu từ formArray
    let details = this.detailsFormGroups.at(index).value;
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.detailsFormGroups.at(index).patchValue(details);
    this.modelTags = [];
    this.indClickTag = -1;
  }

  initFormDetails(details: any[]) {
    details?.forEach(x => {
        const control = <FormArray>this._form.controls['Details'];
        control.push(this.initDetail(x));
    });
  }

  initDetail(x?: LiveCampaignSimpleDetail) {
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
        LiveCampaign_Id: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [0],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: [false]
    });

    if(x) {
        x.LiveCampaign_Id = this.id;
        item.patchValue(x);
    }

    return item;
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    let id = this.id as string;
    this.isLoading = true;
    this.liveCampaignService.deleteDetails(id, [detail.Id]).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.isLoading = false;
            this.message.success('Thao tác thành công');

            this.detailsFormGroups.removeAt(index);

            let data = this.livecampaignSimpleDetail.filter((x: any) => x.Id != detail.Id);
            this.livecampaignSimpleDetail = [...data];

            delete this.isEditDetails[detail.Id];
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }

  removeAllDetail() {
    let formDetails = this.detailsFormGroups.value as LiveCampaignSimpleDetail[];
    let ids = formDetails?.map(x => x.Id) as any[];

    this.modal.warning({
        title: 'Xóa tất cả sản phẩm',
        content: 'Xác nhận xóa tất cả sản phẩm trong chiến dịch',
        onOk: () => {
            this.isLoading = true;
            let id = this.id as string;

            this.liveCampaignService.deleteDetails(id, ids).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: any) => {
                  this.isLoading = false;
                  this.message.success('Thao tác thành công');

                  this.isEditDetails = {};
                  this.detailsFormGroups.clear();
                  this.livecampaignSimpleDetail = [];
              },
              error: (err: any) => {
                  this.isLoading = false;
                  this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
              }
            })
        },
        onCancel:() => {},
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
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
            RemainQuantity: 0,
            ScanQuantity: 0,
            QuantityCanceled: 0,
            UsedQuantity: 0,
            Price: x.ListPrice || 0,
            Note: null,
            ProductId: x.VariantFirstId,
            LiveCampaign_Id: this.id,
            ProductName: x.Name,
            ProductNameGet: x.NameGet,
            UOMId: x.UOMId,
            UOMName: x.UOMName,
            Tags: x.Tags || '',
            LimitedQuantity: 0,
            ProductCode: x.DefaultCode,
            ImageUrl: x.ImageUrl,
            IsActive: true,
        } as LiveCampaignSimpleDetail;

        let name = item.ProductNameGet || item.ProductName;
        let tags = this.generateTagDetail(name, item.ProductCode, item.Tags);
        item.Tags = tags.join(',');

        this.addProductLiveCampaignDetails([item]);
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

  addItemProduct(listData: ProductDTOV2[], isVariants?: boolean){
    let formDetails = this.detailsFormGroups.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x:ProductDTOV2) => {
      let exist = formDetails.filter((f: LiveCampaignSimpleDetail) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];
      if(!exist){
          let qty = Number(this.lstInventory[x.Id]?.QtyAvailable) > 0 ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
          let item = {
              Quantity: qty,
              RemainQuantity: 0,
              ScanQuantity: 0,
              QuantityCanceled: 0,
              UsedQuantity: 0,
              Price: isVariants ? (x.PriceVariant || 0) : (x.Price || 0),
              Note: x.Note,
              ProductId: x.Id,
              LiveCampaign_Id: this.id,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              Tags: '',
              LimitedQuantity: 0,
              ProductCode: x.Barcode || x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
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
        this.addProductLiveCampaignDetails(simpleDetail, isVariants);
    }
  }

  selectProduct(data: ProductDTOV2, index: number){
    this.indClick = index;
    let uomId: number = data.UOMId;
    this.loadProductAttributeLine(data.ProductTmplId, uomId);
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

  getAllVariants(){
    let simpleDetail = [...this.lstVariants];
    this.addItemProduct(simpleDetail, true)
    this.closeSearchProduct();
  }

  getCurrentVariant(data: ProductDTOV2){
    let simpleDetail= [data];
    this.addItemProduct(simpleDetail)
    this.closeSearchProduct();
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

  addProductLiveCampaignDetails(items: LiveCampaignSimpleDetail[], isVariants?: boolean) {
    let id = this.id as string;
    let countNew = 0;
    let countEdit = 0;

    items.map(x => {
      if(x && x.Tags) {
          x.Tags = x.Tags.toString();
      }
    });

    this.isLoading = true;
    this.liveCampaignService.updateDetails(id, items).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any[]) => {
          this.isLoading = false;

          res.map((x: LiveCampaignSimpleDetail, idx: number) => {
              x.ProductName = items[idx].ProductName;
              x.ProductNameGet = items[idx].ProductNameGet;

              let formDetails = this.detailsFormGroups.value as any[];
              let index = formDetails.findIndex(f => f.Id == x.Id && f.ProductId == x.ProductId);

              if(Number(index) >= 0) {
                  index = Number(index);
                  this.detailsFormGroups.at(index).patchValue(x);
                  countEdit +=1;

                  if(!isVariants){
                      this.notificationService.info(`Cập nhật sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm: <span class="font-semibold">${x.ProductName}</span></span><span> Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span></div>`)
                  }
              } else {
                  formDetails = [...[x], ...formDetails];
                  this.detailsFormGroups.clear();
                  countNew +=1;

                  this.initFormDetails(formDetails);
                  if(!isVariants){
                      this.notificationService.info(`Thêm mới sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm: <span class="font-semibold">${x.ProductName}</span></span><span> Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span></div>`)
                  }
              }

              delete this.isEditDetails[x.Id];
          })

          this.livecampaignSimpleDetail = [...this.detailsFormGroups.value];

          if(isVariants) {
              if(countNew > 0) {
                this.notificationService.info(`Thêm sản phẩm`,`<div class="flex flex-col gap-y-2"><span>Biến thể sản phẩm: <span class="font-semibold">${items[0].ProductName}</span></span><span> Số lượng thêm: <span class="font-semibold text-secondary-1">${countNew}</span></span></div>`);
              }

              if(countEdit > 0) {
                  this.notificationService.info(`Cập nhật sản phẩm`,`<div class="flex flex-col gap-y-2"><span>Biến thể sản phẩm: <span class="font-semibold">${items[0].ProductName}</span></span><span> Số lượng cập nhật: <span class="font-semibold text-secondary-1">${countEdit}</span></span></div>`);
              }
          }
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }

  onSave() {
    if(this.isCheckValue() === 0) {
        return;
    }

    let model = this.prepareHandler.prepareModelSimple(this._form) as LiveCampaignSimpleDto;
    let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;

    if(team && team?.Id && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
        model.Facebook_UserId = team.ChannelId;
        model.Facebook_UserName = team.Name;
    }

    let id = this.id as string;
    this.updateLiveCampaign(id, model);
  }

  updateLiveCampaign(id: string, model: LiveCampaignSimpleDto){
    this.isLoading = true;
    this.liveCampaignService.updateSimple(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.message.success('Cập nhật chiến dịch live thành công');
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
    if(Object.keys(this.isEditDetails).length > 0) {
      this.modal.info({
          title: 'Thao tác chưa được lưu',
          content: 'Xác nhận đóng và không lưu dữ liệu',
          onOk: () => {
              this.modalRef.destroy(data);
          },
          onCancel:() => {},
          okText: "Đóng",
          cancelText: "Hủy bỏ"
      });
    } else {
        this.modalRef.destroy(data);
    }
  }

  onEditDetails(item: TDSSafeAny) {
    if(item && item.Id) {
        this.isEditDetails[item.Id] = true;
    }
  }

  onSaveDetails(item: TDSSafeAny) {
    if(item && item.Id) {
        this.addProductLiveCampaignDetails([item]);
    }
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
          if(x && !result.find(y => y == x))
              result.push(x);
        })
    }

    return [...result];
  }

  refreshData() {
    this.visible = false;
    this.searchValue = '';
    this.innerTextValue = '';
    this.dataModel = null as any;

    this.detailsFormGroups.clear();
    this.livecampaignSimpleDetail = [];

    this.loadData();
  }

  onReset(): void {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    this.detailsFormGroups.clear();
    this.initFormDetails(this.livecampaignSimpleDetail);
  }

  onSearch(): void {
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  onOpenSearchvalue(){
    this.visible = true;
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
