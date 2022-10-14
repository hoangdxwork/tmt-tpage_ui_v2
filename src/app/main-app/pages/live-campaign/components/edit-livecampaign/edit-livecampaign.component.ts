import { PrepareAddCampaignHandler } from './../../../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { SharedService } from './../../../../services/shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { GetInventoryDTO } from './../../../../dto/product/product.dto';
import { ProductService } from './../../../../services/product.service';
import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { FastSaleOrderLineService } from 'src/app/main-app/services/fast-sale-orderline.service';
import { StringHelperV2 } from 'src/app/main-app/shared/helper/string.helper';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { Observable, takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { LiveCampaignProductDTO, LiveCampaignDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { ModalAddQuickReplyComponent } from '../../../conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { CRMTeamService } from '@app/services/crm-team.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';

@Component({
  selector: 'edit-livecampaign',
  templateUrl: './edit-livecampaign.component.html',
  providers: [TDSDestroyService]
})

export class EditLiveCampaignComponent implements OnInit {

  _form!: FormGroup;

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  liveCampaignId!: string;
  searchValue = '';
  visible = false;
  innerTextValue: string = '';

  isLoading: boolean = false;
  isShowFormInfo: boolean = true;
  datePicker: Date[] = [];
  tagsProduct: string[] = [];
  isDepositChange: boolean = false;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  dataModel!: LiveCampaignDTO;
  livecampaignSimpleDetail: any[] = [];
  isEditDetails: { [id: string] : boolean } = {};

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies:  Array<QuickReplyDTO> = [];

  lstInventory!: GetInventoryDTO;
  companyCurrents!: CompanyCurrentDTO;

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) => {
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private liveCampaignService: LiveCampaignService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private router: Router,
    private productService: ProductService,
    private notificationService: TDSNotificationService,
    private sharedService: SharedService,
    private prepareHandler: PrepareAddCampaignHandler) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Config: [null],
      Name: [null],
      Note: [null],
      ResumeTime: [0],
      Users: [null],
      StartDate: [Date()],
      EndDate: [Date()],
      Preliminary_Template: [null],
      ConfirmedOrder_Template: [null],
      MinAmountDeposit: [0],
      MaxAmountDepositRequired: [0],
      IsEnableAuto: [false],
      EnableQuantityHandling: [true],
      IsAssignToUserNotAllowed: [true],
      IsShift: [false],
      Facebook_UserId: [null],
      Facebook_UserName: [null],
      Details: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id") as string;
    this.loadData();

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  loadData() {
    let id = this.liveCampaignId;

    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        if(res) {
            delete res['@odata.context'];
            if(res.StartDate) {
                res.StartDate = new Date(res.StartDate)
            }
            if(res.EndDate) {
                res.EndDate = new Date(res.EndDate)
            }

            this.dataModel = res;
            this.updateForm(this.dataModel);
            this.isLoading = false;
        }
      },
      error:(error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.lstUser$ = this.applicationUserService.getUserActive();
  }

  loadQuickReply() {
    this.quickReplyService.setDataActive();
    this.quickReplyService.getDataActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res) {
          let getArr = JSON.parse(localStorage.getItem('arrOBJQuickReply') || '{}');
          this.lstQuickReplies = res?.sort((a: TDSSafeAny, b: TDSSafeAny) => {
              if (getArr != null) {
                return (getArr[b.Id] || { TotalView: 0 }).TotalView - (getArr[a.Id] || { TotalView: 0 }).TotalView;
              } else
                return
          });
        }
      },
      error:(err) => {
          this.message.error(err?.error? err?.error.message: 'Load trả lời nhanh thất bại');
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

  get detailsForm() {
    return this._form.controls["Details"] as FormArray;
  }

  updateForm(data: LiveCampaignDTO) {
    this._form.patchValue(data);

    if(data && data.Details) {
        this.initFormDetails(data.Details);
    }

    this.datePicker = [data.StartDate, data.EndDate];
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  initFormDetails(details: any[]) {
    details?.forEach(x => {
        this.detailsFormGroups.push(this.initDetail(x));
    });
  }

  initDetail(data: LiveCampaignProductDTO | null) {
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

    if(data) {
      data.LiveCampaign_Id = this.liveCampaignId;
      item.patchValue(data);
    }

    return item;
  }


  onLoadProduct(model: any) { 
    let listData = [...(model.value|| [])];
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
              Price: model.isVariants ? (x.PriceVariant || 0) : (x.Price || 0),
              Note: x.Note,
              ProductId: x.Id,
              LiveCampaign_Id: this.liveCampaignId,
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
        this.addProductLiveCampaignDetails(simpleDetail, model.isVariants);
    }
  }

  addProductLiveCampaignDetails(items: LiveCampaignSimpleDetail[], isVariants?: boolean) {
    let id = this.liveCampaignId as string;
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
                this.notificationService.info(`Thêm sản phẩm`,`<div class="flex flex-col gap-y-2"><span>Biến thể sản phẩm: <span class="font-semibold">${res[0].ProductName}</span></span><span> Số lượng thêm: <span class="font-semibold text-secondary-1">${countNew}</span></span></div>`);
              }

              if(countEdit > 0) {
                  this.notificationService.info(`Cập nhật sản phẩm`,`<div class="flex flex-col gap-y-2"><span>Biến thể sản phẩm: <span class="font-semibold">${res[0].ProductName}</span></span><span> Số lượng cập nhật: <span class="font-semibold text-secondary-1">${countEdit}</span></span></div>`);
              }
          }
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }

  generateTagDetail(productName: string, code: string, tags: string) {
    productName = productName.replace(`[${code}]`, "");
    productName = productName.trim();

    let result: string[] = [];
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

    if(TDSHelperString.hasValueString(tags)) {
        let tagArr = tags.split(',');
        tagArr.map(x => {
          if(!result.find(y => y == x))
              result.push(x);
        })
    }

    return [...result];
  }

  openTag(index: number) {
    this.indClickTag = index;
    //TODO: lấy dữ liệu từ formArray
    let data = this.detailsForm.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
      this.modelTags = data.Tags;
    } else {
      this.modelTags = data ? data.Tags.split(",") : [];
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

  refreshData(){
    this.visible = false;
    this.searchValue = '';
    this.innerTextValue = '';
    this.dataModel = null as any;

    this.detailsFormGroups.clear();
    this.livecampaignSimpleDetail = [];

    this.loadData();
  }

  onOpenSearchvalue(){
    this.visible = true;
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(index: number) {
    //TODO: dữ liệu từ formArray
    let details = this.detailsForm.at(index).value;
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.detailsForm.at(index).patchValue(details);
    this.modelTags = [];
    this.indClickTag = -1;

    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeCollapse(event: TDSSafeAny) {
    this.isShowFormInfo = event;
  }

  onBack() {debugger
    if(Object.keys(this.isEditDetails).length > 0) {
      this.modalService.info({
        title: 'Thao tác chưa được lưu',
        content: 'Xác nhận đóng và không lưu dữ liệu',
        onOk: () => {
          history.back(); 
          return;
        },
        onCancel:() => { return; },
        okText: "Đóng",
        cancelText: "Hủy bỏ"
    });
    } else {
      history.back();
    }
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    let id = this.liveCampaignId as string;
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

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModelSimple(this._form) as LiveCampaignSimpleDto;
      let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;

      if(team && team?.Id && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
          model.Facebook_UserId = team.ChannelId;
          model.Facebook_UserName = team.Name;
      }

      let id = this.liveCampaignId as string;
      this.updateLiveCampaign(id, model);
    }
  }

  updateLiveCampaign(id: string, model: LiveCampaignSimpleDto){
    this.isLoading = true;
    this.liveCampaignService.updateSimple(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.message.success('Cập nhật chiến dịch live thành công');
          this.router.navigateByUrl(`/live-campaign/detail/${model.Id}`);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    });
  }

  isCheckValue() {
    let formValue = this._form.value;

    if(!TDSHelperString.hasValueString(formValue.Name)) {
        this.message.error('Vui lòng nhập tên chiến dịch');
        return 0;
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event && event.length > 0) {
        event.forEach(x => {
            this.datePicker.push(x);
        })
        this._form.controls.StartDate.setValue(event[0]);
        this._form.controls.EndDate.setValue(event[1]);
    }
  }

  onChangeDeposit(event:any){
    if(event != this.dataModel.MaxAmountDepositRequired){
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

  showModalAddQuickReply() {
    let modal = this.modalService.create({
        title: 'Thêm mới trả lời nhanh',
        content: ModalAddQuickReplyComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'md'
    });

    modal.afterClose.subscribe({
      next:(res) => {
          this.lstQuickReplies = this.lstQuickReplies.filter(d => d.Id !== 0);
      }
    })
  }

  onDeleteAll(){
    let formDetails = this.detailsFormGroups.value as LiveCampaignSimpleDetail[];
    let ids = formDetails?.map(x => x.Id) as any[];

    this.modalService.error({
      title: 'Xóa sản phẩm',
      content: 'Bạn muốn xóa tất cả sản phẩm?',
      onOk: () => {
          this.isLoading = true;
          let id = this.liveCampaignId as string;

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
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  directPage(route: string) {
    this.router.navigateByUrl(route);
  }

  onChangeIsActive(event: any) {
      this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeQuantity(event: any) {
    if(event) {
        this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
    }
  }

  onChangeLimitedQuantity(event: any) {
    if(event) {
        this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
    }
  }

  onChangePrice(event: any) {
    if(event) {
        this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
    }
  }

  onReset() {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    (<FormArray>this._form.get('Details')).clear();
    this.initFormDetails(this.livecampaignSimpleDetail);
  }

  onSearch() {
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

}
