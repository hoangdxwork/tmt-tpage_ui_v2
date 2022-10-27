import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { FastSaleOrderLineService } from 'src/app/main-app/services/fast-sale-orderline.service';
import { StringHelperV2 } from 'src/app/main-app/shared/helper/string.helper';
import { finalize } from 'rxjs/operators';
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

@Component({
  selector: 'add-livecampaign',
  templateUrl: './add-livecampaign.component.html',
  providers: [TDSDestroyService]
})

export class AddLiveCampaignComponent implements OnInit {

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
    private router: Router) {
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
    this.loadLiveCampaignId();
    this.loadUser();
    this.loadQuickReply();
  }

  loadLiveCampaignId() {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id");
    let path = this.route.snapshot?.routeConfig?.path;

    if(path === "copy/:id" && this.liveCampaignId) {
        this.loadLiveCampaign(this.liveCampaignId, true);
    }
    else if(path == "edit/:id" && this.liveCampaignId) {
        this.loadLiveCampaign(this.liveCampaignId, false);
    }
  }

  loadLiveCampaign(liveCampaignId: string, isCopy: boolean) {
    if(liveCampaignId) {
      this.isLoading = true;
      this.liveCampaignService.getDetailById(liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
          if(res) {
              delete res['@odata.context'];
              this.isLoading = false;

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

              this.updateForm(this.dataModel);
          }
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      })
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

  get detailsForm() {
    return this._form.controls["Details"] as FormArray;
  }

  updateForm(data: LiveCampaignDTO) {
    this._form.patchValue(data);

    if(data && data.Details) {
        data.Details.map((x: LiveCampaignProductDTO) => this.addDetails(x))
    }

    this.datePicker = [data.StartDate, data.EndDate];
    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  addDetails(x: LiveCampaignProductDTO) {
    this.detailsForm.push(this.initDetails(x));
  }

  initDetails(data: LiveCampaignProductDTO | null) {
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

  onLoadProduct(data: TDSSafeAny) {
    // TODO: cập nhật 1 sản phẩm hoặc các biến thể của sản phẩm vào danh sách
    this.onReset();
    if(TDSHelperArray.isArray(data)) {
        let datas = [...data] as DataPouchDBDTO[];
        datas.forEach(x => {
            this.addProduct(x);
        });
    } else {
        let product = {...data};
        this.addProduct(product);
    }

    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  addProduct(product: DataPouchDBDTO){
    let detailValue = this._form.controls['Details'].value;
    let indexExist = detailValue.findIndex((item: any) => `${item.ProductId}_${item.UOMId}` === product.Product_UOMId) as number;

    if(Number(indexExist) >= 0) {
        detailValue[indexExist].Quantity++;

        const control = <FormArray>this._form.controls['Details'];
        control.at(indexExist).setValue(detailValue[indexExist]);
    } else {
        const control = <FormArray>this._form.controls['Details'];
        control.push(this.initDetailBySelectProduct(detailValue.length, product));
    }
  }

  initDetailBySelectProduct(index?: number, product?: DataPouchDBDTO) {
    const model = this.fb.group({
        ProductName: [null],
        ProductNameGet: [null],
        ProductId: [null],
        ProductCode: [null],
        ImageUrl: [null],
        Price: [null],
        UOMId: [null],
        UOMName: [null],
        Quantity: [product?.QtyAvailable || 1],
        LimitedQuantity: [0],
        Index: [index],
        Tags: [null],
        IsActive: [true]
    });

    if(product) {
        let generateTag = this.generateTagDetail(product.NameGet, product.DefaultCode, product.Tags, product);

        model.controls.Tags.setValue(generateTag);
        model.controls.ProductName.setValue(product.NameGet);
        model.controls.ProductNameGet.setValue(product.NameGet);
        model.controls.ImageUrl.setValue(product.ImageUrl);
        model.controls.ProductId.setValue(product.Id);
        model.controls.Price.setValue(product.Price);
        model.controls.UOMId.setValue(product.UOMId);
        model.controls.UOMName.setValue(product.UOMName);
        model.controls.ProductCode.setValue(product.DefaultCode);
    }

    return model;
  }

  generateTagDetail(productName: string, code: string, tags: string, product: any) {
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

    if(TDSHelperString.hasValueString(code) && code && product && Number(product.AttributeLength) <= 0) {
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

    this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onChangeCollapse(event: TDSSafeAny) {
    this.isShowFormInfo = event;
  }

  onBack() {
    history.back();
  }

  removeDetail(index: number, item: TDSSafeAny) {
    const control = <FormArray>this._form.controls['Details'];

    if(item && item.Id) {
      this.isLoading = true;
      this.fastSaleOrderLineService.getByLiveCampaignId(item.Id, item.ProductId, item.UOMId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
            this.isLoading = false;
            if(res && res.value) {
                this.message.error(Message.LiveCampaign.ErrorRemoveLine);
            }  else {
                control.removeAt(index);
            }

            this.liveCampainDetails = [...this._form.controls["Details"].value];
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
        }
      });
    } else {
        control.removeAt(index);
        this.liveCampainDetails = [...this._form.controls["Details"].value];
    }
  }

  onSave(isUpdate?: boolean) {
    if(this.isCheckValue() === 1) {
      let model = this.prepareModel();
      if( model.Id && this.liveCampaignId == model.Id ) {
          this.update(model, isUpdate);
      } else {
          this.create(model);
      }
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

  update(model: any, isUpdate?: boolean) {
    this.isLoading = true;
    this.liveCampaignService.update(model, isUpdate || false).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
            this.isLoading = false;
            this.message.success(Message.ManipulationSuccessful);
            this.router.navigateByUrl(`/live-campaign/detail/${model.Id}`);
        },
        error:(error) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        }
      });
  }

  prepareModel() {
    let formValue = this._form.value;
    let model = {} as any;

    model.Id = (formValue.Id) ? formValue.Id : undefined;
    model.Config = formValue.Config?.value;
    model.Name = formValue.Name;
    model.Users = formValue.Users || [];
    model.Note = formValue.Note;
    model.ResumeTime = formValue.ResumeTime;

    if(this.datePicker){
      model.StartDate = this.datePicker[0];
      model.EndDate = this.datePicker[1];
    }

    model.Preliminary_Template = formValue.Preliminary_Template;
    model.ConfirmedOrder_Template = formValue.ConfirmedOrder_Template;
    model.MinAmountDeposit = formValue.MinAmountDeposit;
    model.MaxAmountDepositRequired = formValue.MaxAmountDepositRequired;
    model.IsEnableAuto = formValue.IsEnableAuto;
    model.EnableQuantityHandling = formValue.EnableQuantityHandling;
    model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
    model.IsShift = formValue.IsShift;
    model.ImageUrl = formValue.ImageUrl;

    model.Facebook_UserId = formValue.FacebookUserId;
    model.Facebook_UserName = formValue.Facebook_UserName;

    formValue.Details?.forEach((x: any, index: number) => {
      if(!TDSHelperString.hasValueString(x.Id)) {
          delete x.Id;
      }

      x["Index"] = index;
      x.Tags = x?.Tags?.toString();

      if(TDSHelperString.hasValueString(model.Id)) {
        x.LiveCampaign_Id = model.Id;
      }
    });

    let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
    if(TDSHelperObject.hasValue(team) && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
        model.Facebook_UserId = team.ChannelId;
        model.Facebook_UserName = team.Name;
    }

    model.Details = formValue.Details;
    return model;
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

    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
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
          this.liveCampainDetails = [...this._form.controls["Details"].value];
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
      this.liveCampainDetails = [...this._form.controls["Details"].value];
  }

  onChangeQuantity(event: any) {
    if(event) {
        this.liveCampainDetails = [...this._form.controls["Details"].value];
    }
  }

  onChangeLimitedQuantity(event: any) {
    if(event) {
        this.liveCampainDetails = [...this._form.controls["Details"].value];
    }
  }

  onChangePrice(event: any) {
    if(event) {
        this.liveCampainDetails = [...this._form.controls["Details"].value];
    }
  }

  onReset() {
    this.searchValue = '';
    this.visible = false;
    (<FormArray>this._form.get('Details')).clear();
    this.liveCampainDetails?.map(x => this.addDetails(x));
  }

  onSearch() {
    let text = TDSHelperString.stripSpecialChars(this.searchValue?.toLocaleLowerCase()).trim();

    let data = this.liveCampainDetails.filter((item: LiveCampaignProductDTO) =>
          TDSHelperString.stripSpecialChars(item.ProductName?.toLocaleLowerCase()).trim().indexOf(text) !== -1
          || item.ProductCode?.indexOf(text) !== -1
          || TDSHelperString.stripSpecialChars(item.UOMName?.toLocaleLowerCase()).trim().indexOf(text) !== -1);

    (<FormArray>this._form.get('Details')).clear();
    data = (data || []).map(x => this.addDetails(x));
  }

}
