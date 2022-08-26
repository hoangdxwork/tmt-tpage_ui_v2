import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from './../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignModel } from './../../dto/live-campaign/odata-live-campaign.dto';
import { finalize, mergeMap } from 'rxjs/operators';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { id } from 'date-fns/locale';
import { Message } from 'src/app/lib/consts/message.const';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, map, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { compareAsc, differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'add-live-campaign',
  templateUrl: './add-live-campaign.component.html',
  providers: [TDSDestroyService]
})
export class AddLiveCampaignComponent implements OnInit {

  @Input() id?: string;
  @Input() isCopy?: boolean;

  @Output() onSuccess = new EventEmitter<any>();

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;

  isLoading: boolean = false;
  _form!: FormGroup;

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private formBuilder: FormBuilder,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private message: TDSMessageService,
    private prepareHandler: PrepareAddCampaignHandler,
    private destroy$: TDSDestroyService
  ) {
    this.createForm();
   }

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    

    this.loadData(this.id);
    this.loadUser();
    this.loadQuickReply();
  }

  createForm() {
    this._form = this.formBuilder.group({
      Id: [this.id],
      Details: this.formBuilder.array([]),
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
      
      this.liveCampaignService.getDetailById(id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe(res => {
          this.updateForm(res);
        });
    }
  }

  updateForm(data: any) {
    if(!this.isCopy) data.Id = undefined;

    this._form.patchValue(data);

    this.initFormDetails(data.Details);
  }

  onChangeDate(event:Date, type:number){
    if(type == 0){
      this._form.controls["StartDate"].setValue(event.toISOString());
    }
    if(type == 1){
      this._form.controls["EndDate"].setValue(event.toISOString());
    }
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  initFormDetails(details: any[]) {
    if(TDSHelperArray.hasListValue(details)) {
      details.forEach(detail => {
        const control = <FormArray>this._form.controls['Details'];
        control.push(this.initDetail(detail));
      });
    }
  }

  initDetail(detail?: any) {
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

      this.fastSaleOrderLineService.getByLiveCampaignId(detail.Id, detail.ProductId, detail.UOMId).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe(res => {
          if(TDSHelperArray.hasListValue(res?.value)) {
            this.message.error(Message.LiveCampaign.ErrorRemoveLine);
          }
          else {
            const control = <FormArray>this._form.controls['Details'];
            control.removeAt(index);
          }
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
    else {
      const control = <FormArray>this._form.controls['Details'];
      control.removeAt(index);
    }
  }

  removeAllDetail() {
    this.message.info('Chưa thể xóa tất cả sản phẩm.');
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);
      this.isLoading = true;
      
      if(this.id){
        model.Id = this.id;

        this.liveCampaignService.update(model,true).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe((res:LiveCampaignModel) => {

          this.message.success(Message.UpdatedSuccess);
          this.onSuccess.emit(res);

          this.onCannel();
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });

      }else{
        
        this.liveCampaignService.create(model).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe((res:LiveCampaignModel) => {

          this.message.success(Message.InsertSuccess);
          this.onSuccess.emit(res);

          this.onCannel();
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
      }
      
    }
  }

  isCheckValue() {
    let formValue = this._form.value;

    if(!TDSHelperString.hasValueString(formValue.Name)){
      this.message.error('Vui lòng nhập tên chiến dịch');

      return 0;
    }

    if(TDSHelperArray.hasListValue(formValue.Details)) {
      let find = formValue.Details.findIndex((x: any) => !this.isNumber(x.Quantity) || !this.isNumber(x.LimitedQuantity) || !this.isNumber(x.Price));

      if(find > -1) {
        this.message.error(Message.LiveCampaign.ErrorNumberDetail);

        return 0;
      }
    }
    
    let compare = compareAsc(new Date(formValue.StartDate).getTime(), new Date(formValue.EndDate).getTime());
    
    if(compare >= 0){
      this.message.error('Vui lòng nhập thời gian Kết thúc lớn hơn thời gian Bắt đầu');

      return 0;
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
