import { finalize } from 'rxjs/operators';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { id } from 'date-fns/locale';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService, TDSModalRef, TDSModalService, TDSSafeAny, TDSHelperArray } from 'tmt-tang-ui';
import { SaleOnlineLiveCampaignDetailDTO, SaleOnline_LiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';

@Component({
  selector: 'add-live-campaign',
  templateUrl: './add-live-campaign.component.html'
})
export class AddLiveCampaignComponent implements OnInit {

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
    private message: TDSMessageService,
  ) { }

  get detailsFormGroups() {
    return (this.formCreateLiveCampaign?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    this.createForm();

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

  removeDetail(index: number, detail: TDSSafeAny) {

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
      let find = details.findIndex((x: any) => !x.Quantity || !x.LimitedQuantity || !x.Price);
      if(find > -1) {
        this.message.error(Message.LiveCampaign.ErrorNumberDetail);
        return 0;
      }
    }


    return 1;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

}
