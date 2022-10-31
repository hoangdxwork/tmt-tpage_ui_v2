import { ImportProductLivecampaignComponent } from './../import-product-livecampaign/import-product-livecampaign.component';
import { PrepareAddCampaignHandler } from './../../../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { TDSNotificationService } from 'tds-ui/notification';
import { GetInventoryDTO } from './../../../../dto/product/product.dto';
import { CompanyCurrentDTO } from './../../../../dto/configs/company-current.dto';
import { ProductService } from './../../../../services/product.service';
import { SharedService } from './../../../../services/shared.service';
import { LiveCampaignSimpleDetail } from './../../../../dto/live-campaign/livecampaign-simple.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { StringHelperV2 } from 'src/app/main-app/shared/helper/string.helper';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { Observable, takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray,TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { LiveCampaignProductDTO, LiveCampaignDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { ModalAddQuickReplyComponent } from '../../../conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { DataPouchDBDTO } from '@app/dto/product-pouchDB/product-pouchDB.dto';

@Component({
  selector: 'add-livecampaign-v2',
  templateUrl: './add-livecampaign-v2.component.html',
  providers: [TDSDestroyService]
})

export class AddLiveCampaignV2Component implements OnInit {

  _form!: FormGroup;

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  liveCampaignId!: string | null;
  searchValue = '';
  visible = false;

  isLoading: boolean = false;
  isShowFormInfo: boolean = true;
  datePicker: Date[] = [];
  tagsProduct: string[] = [];
  isDepositChange: boolean = false;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  dataModel!: LiveCampaignDTO;
  liveCampainDetails: any[] = [];

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies:  Array<QuickReplyDTO> = [];

  lstInventory!: GetInventoryDTO;
  companyCurrents!: CompanyCurrentDTO;
  innerTextValue: string = '';

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  };

  parserComas = (value: TDSSafeAny) => {
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private liveCampaignService: LiveCampaignService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private router: Router,
    private sharedService: SharedService,
    private productService: ProductService,
    private notificationService: TDSNotificationService,
    private prepareHandler: PrepareAddCampaignHandler) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Config: [null],
      ConfigObject: [null],// xóa khi lưu
      Name: [null],
      Note: [null],
      ResumeTime: [0],
      Users: [null],
      StartDate: [new Date()],
      EndDate: [new Date()],
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
      Facebook_UserName: [null],
      Details: this.fb.array([]),
    });

    this._form.controls['ConfigObject'].patchValue(this.lstConfig[0]);
    this._form.controls['Config'].setValue('Draft');
  }

  ngOnInit(): void {
    this.loadLiveCampaignId();
    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  loadLiveCampaignId() {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id");
    let path = this.route.snapshot?.routeConfig?.path;

    if(path === "copy/:id" && this.liveCampaignId) {
        this.loadLiveCampaign(this.liveCampaignId, true);
    }
  }

  loadLiveCampaign(liveCampaignId: string, isCopy: boolean) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {

            if(!res) return;
            delete res['@odata.context'];

            if(res.StartDate) {
                res.StartDate = new Date(res.StartDate)
            }
            if(res.EndDate) {
                res.EndDate = new Date(res.EndDate)
            }

            this.dataModel = res;
            //TODO: trường hợp copy sẽ xóa Id
            if(isCopy == true) {
                delete this.dataModel.Id;
                this.dataModel.Details?.map(x => {
                    delete x.Id;
                })
            }

            if(!res.ConfirmedOrder_TemplateId && res.ConfirmedOrder_Template?.Id) {
                this.dataModel.ConfirmedOrder_TemplateId = res.ConfirmedOrder_Template?.Id;
            }

            if(!res.Preliminary_TemplateId && res.Preliminary_Template?.Id) {
                this.dataModel.Preliminary_TemplateId = res.Preliminary_Template?.Id;
            }

            this.updateForm(this.dataModel);
            this.isLoading = false;
      },
      error:(error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
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

  get detailsFormGroups() {
    return this._form.controls["Details"] as FormArray;
  }

  updateForm(data: LiveCampaignDTO) {
    this._form.patchValue(data);

    this._form.controls["Config"].setValue(data.Config);
    let exist = this.lstConfig.filter((x: any) => x.value === data.Config)[0];
    if(exist) {
        this._form.controls['ConfigObject'].patchValue(exist);
    }

    if(data && data.Details) {
       this.initFormDetails(data.Details);
    }

    this.datePicker = [data.StartDate, data.EndDate];
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  initFormDetails(details: LiveCampaignProductDTO[]) {
    details?.forEach(x => {
        this.detailsFormGroups.push(this.initDetail(x));
    });
  }

  initDetail(data: LiveCampaignProductDTO | null) {
    if(data) {
      let tags: any[] = [];
      if(data.Tags && typeof(data.Tags) == "string") {
          tags = data.Tags.split(",");
      }
      else if(TDSHelperArray.hasListValue(data.Tags)) {
          tags = data.Tags as any;
      }

      return this.fb.group({
          Id: [data.Id],
          ImageUrl: [data.ImageUrl],
          Index: [data.Index],
          IsActive: [data.IsActive],
          LimitedQuantity: [data.LimitedQuantity || 0],
          Note: [data.Note],
          Price: [data.Price],
          ProductCode: [data.ProductCode],
          ProductId: [data.ProductId],
          ProductName: [data.ProductName],
          ProductNameGet: [data.ProductNameGet],
          Quantity: [data.Quantity || 0],
          LiveCampaign_Id: [data.LiveCampaign_Id],
          RemainQuantity: [data.RemainQuantity || 0],
          ScanQuantity: [data.ScanQuantity || 0],
          UsedQuantity: [data.UsedQuantity || 0],
          UOMId: [data.UOMId],
          UOMName: [data.UOMName],
          Tags: [tags],
      })
    } else {
      return this.fb.group({
          Id: [null],
          ImageUrl: [null],
          Index: [null],
          IsActive: [true],
          LimitedQuantity: [0],
          Note: [null],
          Price: [null],
          ProductCode: [null],
          ProductId: [null],
          ProductName: [null],
          ProductNameGet: [null],
          Quantity: [0],
          LiveCampaign_Id: [null],
          QtyAvailable: [0],
          RemainQuantity: [0],
          ScanQuantity: [0],
          UsedQuantity: [0],
          UOMId: [null],
          UOMName: [null],
          Tags: [null]
      })
    }
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

  onLoadProduct(model: DataPouchDBDTO[]) {
    let listData = [...(model|| [])];
    let formDetails = this.detailsFormGroups.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x: DataPouchDBDTO) => {
      let exist = formDetails.filter((f: LiveCampaignProductDTO) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];

      // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
      if(!exist){
          let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
          ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;

          let item = {
              Quantity: qty,
              LiveCampaign_Id: null,
              LimitedQuantity: 0,
              Price: x.Price,
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
          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags, x._attributes_length);
          item.Tags = tags?.join(',');

          simpleDetail = [...simpleDetail, ...[item]];
      } else {
          exist.Quantity += 1;
          simpleDetail = [...simpleDetail, ...[exist]];
      }
    })

    if(simpleDetail && simpleDetail.length > 0){
        this.pushItemToFormArray(simpleDetail)
    }
  }

  pushItemToFormArray(items: LiveCampaignProductDTO[]) {
    let formDetails = this.detailsFormGroups.value as any[];
    let countNew = 0;
    let countEdit = 0;

    items.forEach((item: LiveCampaignProductDTO) => {
        let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
        if(Number(index) >= 0) {
            index = Number(index);
            this.detailsFormGroups.at(index).patchValue(item);

            countEdit +=1;
            this.notificationService.info(`Cập nhật sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm: <span class="font-semibold">[${item.ProductCode}] ${item.ProductName}</span></span><span> Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span></div>`)
        } else {
            formDetails = [...[item], ...formDetails]
            this.detailsFormGroups.clear();
            this.initFormDetails(formDetails);

            countNew +=1;
            this.notificationService.info(`Thêm sản phẩm`, `<div class="flex flex-col gap-y-2"><span>Sản phẩm: <span class="font-semibold">[${item.ProductCode}] ${item.ProductName}</span></span><span> Số lượng: <span class="font-semibold text-secondary-1">${item.Quantity}</span></span></div>`)
        }
    })

    this.liveCampainDetails = [...this.detailsFormGroups.value];
  }

  generateTagDetail(productName: string, code: string, tags: string, _attributes_length?: number) {
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

    if(TDSHelperString.hasValueString(code) && code && _attributes_length == 0) {
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

  openTag(item: any) {
    let formDetails = this.detailsFormGroups.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    this.indClickTag = index;
    //TODO: lấy dữ liệu từ formArray
    let data = this.detailsFormGroups.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
      this.modelTags = data.Tags;
    } else {
      this.modelTags = data ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(item: any) {
    //TODO: dữ liệu từ formArray
    let formDetails = this.detailsFormGroups.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    let details = this.detailsFormGroups.at(index).value;
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.detailsFormGroups.at(index).patchValue(details);
    this.liveCampainDetails = [...this._form.controls["Details"].value];

    this.modelTags = [];
    this.indClickTag = -1;
  }

  onChangeCollapse(event: TDSSafeAny) {
    this.isShowFormInfo = event;
  }

  onBack() {
    history.back();
  }

  removeDetail(index: number, item: TDSSafeAny) {
    const control = <FormArray>this._form.controls['Details'];
    control.removeAt(index);
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);
      this.create(model);
    }
  }

  create(model: any) {
    this.isLoading = true;
    this.liveCampaignService.create(model).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
            this.isLoading = false;
            this.message.success(Message.ManipulationSuccessful);
            this.router.navigateByUrl(`/live-campaign/detail/${res.Id}`);
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
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

    if(event && event.length == 2) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
      this._form.controls.StartDate.setValue(event[0]);
      this._form.controls.EndDate.setValue(event[1]);
    }
  }

  onChangeDeposit(event:any){
    if(this.dataModel && event != this.dataModel.MaxAmountDepositRequired){
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
        if(res) {
          this.lstQuickReplies = [...[res], ...this.lstQuickReplies];
        }
      }
    })
  }

  onDeleteAll(){
    this.modalService.error({
      title: 'Xóa sản phẩm',
      content: 'Bạn muốn xóa tất cả sản phẩm?',
      onOk: () => {
          (<FormArray>this._form.get('Details')).clear();
          this.liveCampainDetails = [];
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

  onChangeIsActive(event: any, item: any) {
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onChangeQuantity(event: any, item: any) {
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onChangeLimitedQuantity(event: any, item: any) {
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onChangePrice(event: any, item: any) {
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onReset() {
    this.innerTextValue = '';
    this.searchValue = '';
    this.visible = false;
    (<FormArray>this._form.get('Details')).clear();
    this.initFormDetails(this.liveCampainDetails);
    this.indClickTag = -1;
  }

  onSearch() {
    this.indClickTag = -1;
    this.liveCampainDetails = [...this.detailsFormGroups.value];
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  onOpenSearchvalue(){
    this.liveCampainDetails = [...this.detailsFormGroups.value];
    this.visible = true;
  }

  showModalSelectFileProduct() {
    this.modalService.create({
      title: 'Chọn sản phẩm từ file',
      size:'xl',
      content: ImportProductLivecampaignComponent,
      viewContainerRef: this.viewContainerRef
    });
  }
}
