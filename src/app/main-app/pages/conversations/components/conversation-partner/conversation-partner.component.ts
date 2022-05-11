import { CheckConversationData, CheckConversationDTO } from './../../../../dto/partner/check-conversation.dto';
import { ChangeDetectorRef, Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMatchingItem, ActiveMatchingPartner } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSMessageService, TDSModalService, TDSHelperString, TDSHelperArray, TDSTagStatusType } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ConversationAllComponent } from '../../conversation-all/conversation-all.component';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { PartnerDTO, PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ModalBlockPhoneComponent } from '../modal-block-phone/modal-block-phone.component';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  @Input() data!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;

  _form!: FormGroup;
  dataMatching!: ActiveMatchingItem;
  objRevenue: any;
  noteData: any = { items: [] };
  destroy$ = new Subject();

  partner!: ActiveMatchingPartner;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  innerNote!: string;
  lastBill: any;
  lstBill: any[] = [];

  tabBillCurrent: number = 0;

  constructor(private message: TDSMessageService,
    private draftMessageService: DraftMessageService,
    private conversationEventFacade: ConversationEventFacade,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private crmService: CRMTeamService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private crmMatchingService: CRMMatchingService,
    public router: Router) {
      this.createForm();
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
        Ward: [null],
        Address: [null]
    });
  }

  ngOnInit(): void  {
    if(this.data?.id) {
        this.loadData(this.data);
    }
    this.loadPartnerStatus();
  }

  loadData(data: ActiveMatchingItem) {
    if(data?.page_id && data?.psid) {
      this.loadNotes(data?.page_id, data?.psid);
    }
    if(data?.partner && (data?.partner_id || data?.partner?.id)) {
      let id = data?.partner_id || data?.partner?.id;
      this.loadPartnerRevenue(id);
      this.loadBill(this.data.partner_id || this.data.partner.id);
    }

    this.partner = data?.partner;

    //TODO: checkconversation để đẩy dữ liệu sang tab đơn hàng vs tab khách hàng
    let page_id = data?.page_id;
    let psid = data?.psid;
    this.partnerService.checkConversation(page_id, psid).pipe(takeUntil(this.destroy$))
      .subscribe((res: CheckConversationDTO) => {
        if(res?.Data && res?.Success) {

          res.Data.Name = res.Data.Name || data.name;
          res.Data.Facebook_ASUserId = res.Data.Facebook_ASUserId || this.data.psid;
          res.Data.Phone = res.Data.Phone || this.data.phone;
          res.Data.Street = res.Data.Street || this.data.address;
          this.updateForm(res.Data);

          this.partnerService.onLoadOrderFromTabPartner.emit(res.Data);
        }
      }, error => {
        this.message.error('Check conversation đã xảy ra lỗi!');
    });
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = res;
    });
  }

  loadPartnerRevenue(id: number){
    this.partnerService.getPartnerRevenueById(id).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.objRevenue = res;
    }, error => {
      this.message.error('Load doanh thu khách hàng đã xảy ra lỗi');
    });
  }

  loadBill(partnerId: any) {
    this.lstBill.length = 0;
    this.fastSaleOrderService.getConversationOrderBillByPartner(partnerId).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        console.log(res);
        this.lstBill = res.Result || [];
        this.lastBill = res.LastSaleOrder || null;
      }, error => {
        this.message.error('Load hóa đơn khách hàng trong hội thoại đã xảy ra lỗi!');
      })
  }

  updateForm(data: CheckConversationData){
    if(data?.Id) {
      this._form.controls['FacebookASIds'].setValue(data.Facebook_ASUserId);
      this._form.patchValue(data);
    }
  }

  addNote(): any {
    if(!TDSHelperString.hasValueString(this.innerNote)) {
      this.message.error(Message.EmptyData);
      return;
    }

    let model = {
      message: this.innerNote,
      psid: this.data?.psid,
      page_id: this.data?.page_id
    };

    // TODO: Thêm loading
    this.crmMatchingService.addNote(this.data?.psid, model)
      .subscribe(res => {
        this.innerNote = '';
        this.message.success(Message.Partner.AddNoteSuccess);
        this.loadNotes(this.data?.page_id, this.data?.psid);
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
    })
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
    console.log(event);
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
        debugger;
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
    const modal = this.modalService.create({
      title: '',
      content: ModalBlockPhoneComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.data = changes["data"].currentValue;
        this.loadData(this.data);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
