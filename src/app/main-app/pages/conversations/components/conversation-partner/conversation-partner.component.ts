import { CheckConversationData, CheckConversationDTO } from './../../../../dto/partner/check-conversation.dto';
import { ChangeDetectorRef, Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationMatchingItem, ActiveMatchingPartner } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSMessageService, TDSModalService, TDSHelperString, TDSHelperArray, TDSTagStatusType, TDSHelperObject } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ConversationAllComponent } from '../../conversation-all/conversation-all.component';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO, PartnerDTO, PartnerStatusDTO, PartnerTempDTO, ResRevenueCustomerDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ModalBlockPhoneComponent } from '../modal-block-phone/modal-block-phone.component';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ConversationOrderBillByPartnerResultDTO } from 'src/app/main-app/dto/conversation/conversation.dto';
import { ViewConversation_FastSaleOrdersDTO } from 'src/app/main-app/dto/fastsaleorder/view_fastsaleorder.dto';
import { CheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ODataModelTeamDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { ModalListBlockComponent } from '../modal-list-block/modal-list-block.component';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  @Input() data!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;

  @Output() onTabOrder = new EventEmitter<boolean>();

  _form!: FormGroup;
  dataMatching!: ConversationMatchingItem;
  objRevenue!: ResRevenueCustomerDTO;
  noteData: any = { items: [] };
  destroy$ = new Subject();

  partner!: ActiveMatchingPartner;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  innerNote!: string;
  totalBill: number = 0;
  lastBill!: ViewConversation_FastSaleOrdersDTO | undefined;
  lstBill: ConversationOrderBillByPartnerResultDTO[] = [];

  tabBillCurrent: number = 0;
  isEditPartner: boolean = false;
  formData!: CheckConversationData;

  isLoading: boolean = false;

  constructor(private message: TDSMessageService,
    private draftMessageService: DraftMessageService,
    private conversationEventFacade: ConversationEventFacade,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private crmMatchingService: CRMMatchingService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private router: Router) {
  }

  ngOnInit(): void  {
    this.createForm();
    this.loadPartnerStatus();

    this.loadPartnerByOrder();
    debugger;
    this.loadPartnerByPostComment();

    if(this.data?.id) {
        this.loadData(this.data);
    }

  }

  createForm(){
    this._form = this.fb.group({
        Id: [null],
        StatusText: [null],
        Name: [null],
        Phone: [null],
        PhoneReport: [null],
        Email: [null],
        Comment: [null],
        Street: [null],
        FacebookASIds: [null],
        FacebookId: [null],
        City: [null],
        District: [null],
        Ward: [null]
    });
  }

  loadPartnerByOrder() {
    this.partnerService.onLoadPartnerFromTabOrder
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if(res?.psid && this.data?.psid && res.psid === this.data.psid) {
          this.loadData(res);
        }
      });
  }

  loadPartnerByPostComment() {
    this.partnerService.onLoadPartnerFormPostComment
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        debugger;
        let psid = res?.from?.id;
        let pageId = this.team.Facebook_PageId;
        this.loadDataPartner(pageId, psid);
      });
  }

  loadDataPartner(pageId: string, psid: string, partnerId?: number) {
    if(!TDSHelperString.hasValueString(pageId) || !TDSHelperString.hasValueString(psid)) {
      this.message.error(Message.ErrorOccurred);
      return;
    }

    this.partnerService.checkConversation(pageId, psid)
      .subscribe((res: CheckConversationDTO) => {
        if(res?.Data && res?.Success) {
          res.Data.Name = res.Data.Name || res.Data.Facebook_UserName;

          if(this.data) { // Cập nhật theo partner mapping
            res.Data.Name = res.Data.Name || this.data.name || res.Data.Facebook_UserName;
            res.Data.Facebook_ASUserId = res.Data.Facebook_ASUserId || this.data.psid;
            res.Data.Phone = res.Data.Phone || this.data.phone;
            res.Data.Street = res.Data.Street || this.data.address;
          }

          this.formData = res.Data;
          this.updateForm(res.Data);

          partnerId = partnerId || res.Data?.Id;
          if(partnerId) {
            this.loadPartnerRevenue(partnerId);
            this.loadBill(partnerId);
          }

          this.loadNotes(pageId, psid);
          this.partnerService.onLoadOrderFromTabPartner.emit(res.Data);
        }
        else {
          this.message.error(Message.ErrorOccurred);
        }
      }, error => {
        this.message.error('Check conversation đã xảy ra lỗi!');
      });
  }

  loadData(data: ConversationMatchingItem) {
    let psid = data?.psid;
    let pageId = data?.page_id;
    this.loadDataPartner(pageId, psid);
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = res;
    });
  }

  loadPartnerRevenue(id: number){
    (this.objRevenue as any) = null;
    this.partnerService.getPartnerRevenueById(id).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
          this.objRevenue = res;
    }, error => {
      this.message.error('Load doanh thu khách hàng đã xảy ra lỗi');
    });
  }

  loadBill(partnerId: number) {
    this.lstBill = [];
    this.totalBill = 0;
    this.lastBill = undefined;
    this.fastSaleOrderService.getConversationOrderBillByPartner(partnerId).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.lstBill = res.Result || [];
        this.totalBill = this.lstBill.reduce((x, y) => x + y.total, 0);
        this.lastBill = res.LastSaleOrder || undefined;
      }, error => {
        this.message.error('Load hóa đơn khách hàng trong hội thoại đã xảy ra lỗi!');
      });
  }

  updateForm(data: CheckConversationData){
    if(data?.Id) {
      this._form.patchValue(data);
      this._form.controls['FacebookASIds'].setValue(data.Facebook_ASUserId);
    }
    else {
      this._form.patchValue(data);
      this._form.controls['FacebookASIds'].setValue(data.Facebook_ASUserId);
    }
  }

  addNote() {
    if(!TDSHelperString.hasValueString(this.innerNote)) {
      this.message.error(Message.EmptyData);
      return;
    }

    let model = {} as MDBFacebookMappingNoteDTO;
    model.message = this.innerNote;
    model.psid = this.formData.Facebook_ASUserId;
    model.page_id = this.team?.Facebook_PageId;

    // TODO: Thêm loading
    this.crmMatchingService.addNote(model.psid, model)
      .subscribe(res => {
        this.innerNote = '';
        this.message.success(Message.Partner.AddNoteSuccess);
        this.loadNotes(model.page_id, model.psid);
      }, error => {
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
  }

  loadNotes(page_id: string, psid: string) {
    this.noteData = { items: [] };
    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.noteData.items = [...this.noteData.items, ...res.Items];
    }, error => {
        this.message.error('Load ghi chú khách hàng đã xảy ra lỗi');
    });
  }

  removeNote(id: any, index: number) {
    this.conversationService.deleteNote(id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.noteData.items[index].id === id) {
        this.noteData.items.splice(index, 1);
      }
      this.message.success(Message.Partner.RemoveNoteSuccess);
    }, error => {
      this.message.error('Xóa ghi chú khách hàng đã xảy ra lỗi');
    });
  }

  onChangeBill(event: any) {
    this.tabBillCurrent = event;
  }

  selectStatus(status: PartnerStatusDTO) {
    if(this.partner?.id) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(this.partner?.id, data).subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        this.partner.status_text = status.text;
        // this.formEditOrder.controls["Partner"].setValue(partner);
      });
    }
    else {
      this.message.error(Message.PartnerNotInfo);
    }
  }

  getStatusColor() {
    if(this.partner && TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
      let value = this.lstPartnerStatus.find(x => x.text == this.partner.status_text);
      if(value) return value.value;
      else return '#e5e7eb';
    }
    else return '#e5e7eb';
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đã thanh toán":
        return "success";
      case "Hủy bỏ":
        return "error";
      default:
        return "warning";
    }
  }

  showModalBlockPhone() {
    let phone = this.formData?.Phone;

    const modal = this.modalService.create({
      title: '',
      content: ModalBlockPhoneComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {
        phone: phone
      }
    });

    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        // Cập nhật form PhoneReport.value;
      }
    });

  }

  showModalListBlock() {
    let phone = this.formData?.Phone;
    let currentTeam = this.crmTeamService.getCurrentTeam();
    let phoneReport = this._form.value?.PhoneReport;

    const modal = this.modalService.create({
      title: 'Lịch sử chặn',
      content: ModalListBlockComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        phone: phone,
        psid: this.formData?.Facebook_ASUserId,
        accessToken: currentTeam?.Facebook_PageToken,
        facebookName: this.formData?.Facebook_UserName,
        isReport: phoneReport
      }
    });

    modal.componentInstance?.changeReportPartner.subscribe(res => {
      this._form.controls.PhoneReport.setValue(res);
    });

    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        // Cập nhật form PhoneReport.value;
      }
    });

  }

  onEditPartner() {
    this.isEditPartner = !this.isEditPartner;
  }

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this._form.controls;

    formControls["Street"].setValue(event.Street);

    formControls["City"].setValue( event.City?.Code ? {
      code: event.City?.Code,
      name: event.City?.Name
    } : null);

    formControls["District"].setValue( event.District?.Code ? {
      code: event.District?.Code,
      name: event.District?.Name,
    } : null);

    formControls["Ward"].setValue( event.Ward?.Code ? {
      code: event.Ward?.Code,
      name: event.Ward?.Name,
    } : null);

  }

  onCancelEdit() {
    this.updateForm(this.formData);
    this.isEditPartner = false;
  }

  onSaveEdit() {
    this.isLoading = true;
    let model = this.prepareModelPartner();

    this.saleOnline_OrderService.createUpdatePartner(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        this.isEditPartner = false;
        this.loadDataPartner(this.team?.Facebook_PageId, this.formData?.Facebook_ASUserId);
      }, error => {
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
  }

  prepareModelPartner() {
    let data = this._form.value as PartnerTempDTO;
    let currentTeam = this.crmTeamService.getCurrentTeam();
    let model = {} as ODataModelTeamDTO<PartnerTempDTO>;

    data.Phone = data.Phone === "" ? undefined : data.Phone;
    data.Street = data.Street === "" ? undefined : data.Street;
    model.model = data;
    model.teamId = currentTeam?.Id;

    return model;
  }

  validateData() {
    (this.data as any) = null;
    (this.partner as any) = null;
    this._form.reset();
  }

  createOrder() {
    this.onTabOrder.emit(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.validateData();
        this.data = changes["data"].currentValue;
        this.loadData(this.data);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
