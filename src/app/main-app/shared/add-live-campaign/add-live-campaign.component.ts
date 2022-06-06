import { finalize } from 'rxjs/operators';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { id } from 'date-fns/locale';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService, TDSModalRef, TDSModalService, TDSSafeAny, TDSHelperArray, TDSHelperString } from 'tmt-tang-ui';
import { SaleOnlineLiveCampaignDetailDTO, SaleOnline_LiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';

@Component({
  selector: 'add-live-campaign',
  templateUrl: './add-live-campaign.component.html'
})
export class AddLiveCampaignComponent implements OnInit {

  @Input() id?: string;
  @Input() isCopy?: boolean;

  @Output() onSuccess = new EventEmitter<SaleOnline_LiveCampaignDTO>();

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;

  isLoading: boolean = false;
  formCreateLiveCampaign!: FormGroup;

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private formBuilder: FormBuilder,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private message: TDSMessageService,
  ) { }

  get detailsFormGroups() {
    return (this.formCreateLiveCampaign?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    this.createForm();

    this.loadData(this.id);
    this.loadUser();
    this.loadQuickReply();
  }

  createForm() {
    this.formCreateLiveCampaign = this.formBuilder.group({
      Details: this.formBuilder.array([]),
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
      EnableQuantityHandling: [false],
      IsAssignToUserNotAllowed: [false],
      // IsShift: [false]
    });
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$;
  }

  loadQuickReply() {
    this.lstQuickReplies$ = this.quickReplyService.dataActive$;
  }

  loadData(id?: string) {
    if(id) {
      this.isLoading = true;
      this.liveCampaignService.getDetailById(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.updateForm(res);
        });
    }
  }

  updateForm(data: SaleOnline_LiveCampaignDTO) {
    if(!this.isCopy) data.Id = undefined;

    this.formCreateLiveCampaign.patchValue(data);

    this.initFormDetails(data.Details);
  }

  initFormDetails(details: SaleOnlineLiveCampaignDetailDTO[]) {
    if(TDSHelperArray.hasListValue(details)) {
      details.forEach(detail => {
        const control = <FormArray>this.formCreateLiveCampaign.controls['Details'];
        control.push(this.initDetail(detail));
      });
    }
  }

  initDetail(detail?: SaleOnlineLiveCampaignDetailDTO) {
    let detailFormGroup = this.formBuilder.group({
        Id: [null],
        Index: [null],
        Quantity: [null],
        RemainQuantity: [null],
        ScanQuantity: [null],
        UsedQuantity: [null],
        Price: [null],
        Note: [null],
        ProductId: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [null],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: true
    });

    if(detail) {
      detailFormGroup.patchValue(detail);
    }

    return detailFormGroup;
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    if(TDSHelperString.hasValueString(detail?.Id) && !this.isCopy) {
      this.isLoading = true;
      this.fastSaleOrderLineService.getByLiveCampaignId(detail.Id, detail.ProductId, detail.UOMId).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
        if(TDSHelperArray.hasListValue(res?.value)) {
          this.message.error(Message.LiveCampaign.ErrorRemoveLine);
        }
        else {
          const control = <FormArray>this.formCreateLiveCampaign.controls['Details'];
          control.removeAt(index);
        }
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
    }
    else {
      const control = <FormArray>this.formCreateLiveCampaign.controls['Details'];
      control.removeAt(index);
    }
  }

  removeAllDetail() {
    this.message.info('Chưa thể xóa tất cả sản phẩm.');
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareModel();

      this.isLoading = true;
      this.liveCampaignService.create(model)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.message.success(Message.InsertSuccess);
          this.onSuccess.emit(res);
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
  }

  prepareModel() {
    let formValue = this.formCreateLiveCampaign.value;

    let model = {} as SaleOnline_LiveCampaignDTO;

    model.Config = formValue.Config?.value;
    model.Name = formValue.Name;
    model.Users = formValue.Users || [];
    model.Note = formValue.Note;
    model.ResumeTime = formValue.ResumeTime;
    model.StartDate = formValue.StartDate;
    model.EndDate = formValue.EndDate;
    model.Preliminary_Template = formValue.Preliminary_Template;
    model.ConfirmedOrder_Template = formValue.ConfirmedOrder_Template;
    model.MinAmountDeposit = formValue.MinAmountDeposit;
    model.MaxAmountDepositRequired = formValue.MaxAmountDepositRequired;
    model.EnableQuantityHandling = formValue.EnableQuantityHandling;
    model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
    // model.IsShift = formValue.IsShift;

    if (TDSHelperArray.hasListValue(formValue.Details)) {
      formValue.Details.forEach((detail: SaleOnlineLiveCampaignDetailDTO, index: number) => {
        detail["Index"] = index;
      });
    }

    model.Details = formValue.Details;

    return model;
  }

  isCheckValue() {
    let formValue = this.formCreateLiveCampaign.value;

    let details = formValue.Details;

    if(TDSHelperArray.hasListValue(details)) {
      let find = details.findIndex((x: any) => !this.isNumber(x.Quantity) || !this.isNumber(x.LimitedQuantity) || !this.isNumber(x.Price));
      if(find > -1) {
        this.message.error(Message.LiveCampaign.ErrorNumberDetail);
        return 0;
      }
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

}
