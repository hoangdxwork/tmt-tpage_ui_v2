import { LiveCampaignDTO } from './../../dto/live-campaign/odata-live-campaign.dto';
import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
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
import { differenceInCalendarDays, isFirstDayOfMonth } from 'date-fns';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { ProductService } from '@app/services/product.service';
import { LiveCampaignProductDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSTableComponent } from 'tds-ui/table';
import { TDSNotificationService } from 'tds-ui/notification';
import { StringHelperV2 } from '../helper/string.helper';
import { SyncCreateProductTemplateDto } from '@app/dto/product-pouchDB/product-pouchDB.dto';

@Component({
  selector: 'add-livecampaign-post',
  templateUrl: './add-livecampaign-post.component.html',
  providers: [TDSDestroyService]
})

export class AddLiveCampaignPostComponent implements OnInit {

  @Input() id?: string;
  @Input() isCopy?: boolean;

  selectedIndex: number = 0;
  _form!: FormGroup;

  @ViewChild('virtualTable', { static: false }) tdsTableComponent?: TDSTableComponent<any>;

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
  lstProductSearch: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  isEditDetails: { [id: string] : boolean } = {};
  liveCampainDetails: any = [];
  isFilter: boolean = false;

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
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private notificationService: TDSNotificationService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private productService: ProductService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private prepareHandler: PrepareAddCampaignHandler,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService) {
      this.createForm();
   }

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id && TDSHelperString.hasValueString(this.id)) {
      this.loadData(this.id);
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
      }
    })
  }

  loadQuickReply() {
    this.quickReplyService.setDataActive();
    this.lstQuickReplies$ = this.quickReplyService.getDataActive();
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;
    let top = 30;
    let skip = 0;

    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: ODataProductDTOV2) => {
          this.lstProductSearch = [...res.value];
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

              this.dataModel = {...res};
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
        delete this.id;
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

  initFormDetails(details: any[]) {
    details?.forEach(x => {
        const control = <FormArray>this._form.controls['Details'];
        control.push(this.initDetail(x));
    });
  }

  initDetail(x?: LiveCampaignProductDTO) {
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
      x.LiveCampaign_Id = this.id;
      item.patchValue(x);
    }

    return item;
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    let id = this.id as string;

    if(TDSHelperString.hasValueString(this.id)) {
      this.isLoading = true;
      this.liveCampaignService.deleteDetails(id, [detail.Id]).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              this.isLoading = false;
              this.message.success('Thao tác thành công');

              this.detailsFormGroups.removeAt(index);
              this.liveCampainDetails = [...this.detailsFormGroups.value];
              delete this.isEditDetails[detail.Id];
          },
          error: (err: any) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
          }
      })
    } else {
        this.detailsFormGroups.removeAt(index);
        this.liveCampainDetails = [...this.detailsFormGroups.value];
    }
  }

  removeAllDetail() {
    let formDetails = this.detailsFormGroups.value as LiveCampaignProductDTO[];

    if(TDSHelperString.hasValueString(this.id)) {
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

                    this.liveCampainDetails = [];
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
    } else {
        this.detailsFormGroups.clear();
        this.liveCampainDetails = [];
    }
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

      if(res.type === 'select' && res.productTmpl) {
        this.onReset();
        let x = res.productTmpl as ProductTemplateV2DTO;

        let item = {
            Quantity: 1,
            LiveCampaign_Id: this.id || null,
            LimitedQuantity: 0,
            Price: x.ListPrice || 0,
            Note: null,
            ProductId: x.VariantFirstId,
            ProductName: x.Name,
            ProductNameGet: x.NameGet,
            RemainQuantity: 0,
            ScanQuantity: 0,
            Tags: x.OrderTag || '',
            UOMId: x.UOMId,
            UOMName: x.UOMName,
            ProductCode: x.DefaultCode,
            ImageUrl: x.ImageUrl,
            IsActive: x.Active,
            UsedQuantity: 0
        } as LiveCampaignProductDTO;

        let name = item.ProductNameGet || item.ProductName;
        let tags = this.generateTagDetail(name, item.ProductCode, item.Tags);
        item.Tags = tags.join(',');

        if(TDSHelperString.hasValueString(this.id)) {
            this.addProductLiveCampaignDetails(item);
        } else {
            this.pushItemToFormArray(item);
        }
      }
    })
  }

  onSearchProduct(event: any) {
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
  }

  selectProduct(data: ProductDTOV2){
    this.onReset();
    let formDetails = this.detailsFormGroups.value as any[];
    let exist = formDetails.filter((f:LiveCampaignProductDTO) => f.ProductId == data.Id && f.UOMId == data.UOMId)[0];

    // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
    if(!exist){
        let qty = Number(this.lstInventory[data.Id]?.QtyAvailable) > 0 ? Number(this.lstInventory[data.Id]?.QtyAvailable) : 1;
        let item = {
            Quantity: qty,
            LiveCampaign_Id: this.id || null,
            LimitedQuantity: 0,
            Price: data.Price || 0,
            Note: data.Note || null,
            ProductId: data.Id,
            ProductName: data.Name,
            ProductNameGet: data.NameGet,
            RemainQuantity: 0,
            ScanQuantity: 0,
            Tags: '',
            UOMId: data.UOMId,
            UOMName: data.UOMName,
            ProductCode: data.DefaultCode,
            ImageUrl: data.ImageUrl,
            IsActive: true,
            UsedQuantity: 0
        } as LiveCampaignProductDTO;

        let name = item.ProductNameGet || item.ProductName;
        let tags = this.generateTagDetail(name, item.ProductCode, item.Tags);
        item.Tags = tags?.join(',');

        if(TDSHelperString.hasValueString(this.id)) {
            this.addProductLiveCampaignDetails(item);
        } else {
            this.pushItemToFormArray(item);
        }

    } else {
        exist.Quantity += 1;
        if(TDSHelperString.hasValueString(this.id)) {
            this.addProductLiveCampaignDetails(exist);
        } else {
            this.pushItemToFormArray(exist);
        }
    }

    this.closeSearchProduct();
  }

  addProductLiveCampaignDetails(item: LiveCampaignProductDTO) {
    let id = this.id as string;
    item.Tags = item.Tags?.toString();
    let model = [item];

    this.isLoading = true;
    this.liveCampaignService.updateDetails(id, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.isLoading = false;

          let x = res[0] as LiveCampaignProductDTO;
          x.ProductName = item.ProductName;
          x.ProductNameGet = item.ProductNameGet;

          let formDetails = this.detailsFormGroups.value as any[];
          let index = formDetails.findIndex(f => f.Id == x.Id && f.ProductId == x.ProductId);

          if(Number(index) >= 0) {
              index = Number(index);
              this.detailsFormGroups.at(index).patchValue(x);

              this.notificationService.info(`Cập nhật sản phẩm ${x.ProductName}`, `Số lượng hiện tại là <span class="font-semibold text-secondary-1">${x.Quantity}</span>`)
          } else {
              formDetails = [...[x], ...formDetails]
              this.detailsFormGroups.clear();
              this.initFormDetails(formDetails);

              this.notificationService.info(`Thêm mới sản phẩm ${x.ProductName}`, `Đã thêm thành công <span class="font-semibold text-secondary-1">${x.Quantity}</span> sản phẩm ${x.ProductName}`)
          }

          delete this.isEditDetails[x.Id];
          this.liveCampainDetails = [...this.detailsFormGroups.value];
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }

  pushItemToFormArray(item: LiveCampaignProductDTO) {
    let formDetails = this.detailsFormGroups.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
    if(Number(index) >= 0) {
        index = Number(index);
        this.detailsFormGroups.at(index).patchValue(item);
    } else {
        formDetails = [...[item], ...formDetails]
        this.detailsFormGroups.clear();
        this.initFormDetails(formDetails);
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

      if(TDSHelperString.hasValueString(this.id)) {
          let id = this.id as string;
          this.updateLiveCampaign(id, model);
      } else {
          this.createLiveCampaign(model);
      }
    }
  }

  updateLiveCampaign(id: string, model: LiveCampaignModel){
    model.Id = id;
    model.Details = [];

    this.isLoading = true;
    this.liveCampaignService.updateSimple(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res:LiveCampaignModel) => {
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
        this.addProductLiveCampaignDetails(item);
    }
  }

  scrollToIndex(index: number): void {
    this.tdsTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
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
    if(this.id) {
        this.dataModel = null as any;
        this.detailsFormGroups.clear();
        this.liveCampainDetails = [];
        this.loadData(this.id);
    } else {
        this.detailsFormGroups.clear();
        this.initFormDetails(this.liveCampainDetails);
    }
  }

  onReset(): void {
    this.searchValue = '';
    this.visible = false;
    this.isFilter = false;
    this.detailsFormGroups.clear();
    this.initFormDetails(this.liveCampainDetails);
  }

  onSearch(): void {
    this.visible = false;
    this.isFilter = true;
    let text = TDSHelperString.stripSpecialChars(this.searchValue?.toLocaleLowerCase()).trim();

    let data = this.liveCampainDetails.filter((item: LiveCampaignProductDTO) =>
          TDSHelperString.stripSpecialChars(item.ProductName?.toLocaleLowerCase()).trim().indexOf(text) !== -1
          || item.ProductCode?.indexOf(text) !== -1
          || TDSHelperString.stripSpecialChars(item.UOMName?.toLocaleLowerCase()).trim().indexOf(text) !== -1);

    this.detailsFormGroups.clear();
    this.initFormDetails(data);
  }

}
