import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { CheckConversationData } from './../../../../dto/partner/check-conversation.dto';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO,PartnerStatusDTO,PartnerTempDTO, ResRevenueCustomerDTO } from 'src/app/main-app/dto/partner/partner.dto';
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
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TabPartnerCvsRequestDTO, TabPartnerCvsRequestModel } from 'src/app/main-app/dto/conversation-partner/partner-conversation-request.dto';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  _form!: FormGroup;

  @Input() data!: ConversationMatchingItem; // dữ liệu nhận từ conversation-all
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;
  @Output() onTabOrder = new EventEmitter<boolean>(); // sự kiện đổi tab

  objRevenue!: ResRevenueCustomerDTO;
  noteData: any = { items: [] };
  destroy$ = new Subject<void>();

  // partner!: ActiveMatchingPartner;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  innerNote!: string;
  totalBill: number = 0;
  lastBill!: ViewConversation_FastSaleOrdersDTO | undefined;
  lstBill: ConversationOrderBillByPartnerResultDTO[] = [];

  tabBillCurrent: number = 0;
  isEditPartner: boolean = false;
  partner!: TabPartnerCvsRequestModel | null;
  isLoading: boolean = false;

  constructor(private message: TDSMessageService,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private cdRer: ChangeDetectorRef,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private crmMatchingService: CRMMatchingService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private conversationDataFacade: ConversationDataFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private router: Router) {
  }

  ngOnInit(): void  {
    if(this.data) {
      let psid = this.data?.psid;
      let pageId = this.data?.page_id || this.team.Facebook_PageId;
      this.loadData(pageId, psid);
    }

    // TODO: sự kiện load lại form conversation-partner từ conversation-order
    this.loadPartnerFromTabOrder();

    // TODO: sự kiện load lại form conversation-partner từ comment bài post
    this.loadPartnerByPostComment();

    // TODO: update partner từ conversation realtime signalR
    this.loadUpdateInfoByConversation();

    // TODO: update partner từ conversation item
    this.onSelectOrderFromMessage();

    this.loadPartnerStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.data = {...changes["data"].currentValue};

        let psid = this.data?.psid;
        let pageId = this.data?.page_id || this.team.Facebook_PageId;
        this.loadData(pageId, psid);
    }
  }

  loadData(pageId: string, psid: string): any {

    if(!TDSHelperString.hasValueString(pageId)) {
        return this.message.error('Không tìm thấy Facebook_PageId');
    }
    if(!TDSHelperString.hasValueString(psid)) {
        return this.message.error('Không tìm thấy psid');
    }

    this.isLoading = true;
    this.partner = null;

    this.partnerService.checkConversation(pageId, psid).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
        .subscribe((res: TabPartnerCvsRequestDTO) => {

            if(res?.Data && res?.Success) {
                let x = { ... res.Data} as TabPartnerCvsRequestModel;

                x.Facebook_ASUserId = x.Facebook_ASUserId || this.data.id;
                x.Name = x.Name || x.Facebook_UserName || this.data.name;
                x.Phone = x.Phone || this.data.phone;
                x.Street = x.Street || this.data.address;

                this.partner = {...x};
                this.cdRer.detectChanges();
            }
        }, error => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        })
  }

  loadPartnerFromTabOrder() {
    this.isLoading = true;
    this.partnerService.onLoadPartnerFromTabOrder$.pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
        if(res?.psid === this.data?.psid) {
            // this.loadData(res);
        }
    });
  }

  loadPartnerByPostComment() {
    (this.data as any) = null;
    this.isLoading = true;
    this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$)).subscribe(res => {

        if(res && this.data) {
          let pageId = this.team.Facebook_PageId;
          let psid = res.psid;
          this.loadData(pageId, psid);
        }
    });
  }

  loadUpdateInfoByConversation() {
    this.isLoading = true;
    this.conversationDataFacade.onUpdateInfoByConversation$.pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {

        if(res) {
            if(!TDSHelperString.hasValueString(this.partner?.Phone) && res.has_phone && TDSHelperString.hasValueString(res.phone) && this.partner){
                this.partner.Phone = res.phone;
            }
            if(!TDSHelperString.hasValueString(this.partner?.Street) && res.has_address && TDSHelperString.hasValueString(res.address) && this.partner){
                this.partner.Street = res.address;
            }
        }
        this.cdRer.detectChanges();
    })
  }

  onSelectOrderFromMessage() {
    this.isLoading = true;
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {

        if(res && TDSHelperString.hasValueString(res.phone) && this.partner) {
            this.partner.Phone = res.phone;
        }
        if(res && TDSHelperString.hasValueString(res.address) && this.partner) {
            this.partner.Street = res.address;
        }
        if(res && TDSHelperString.hasValueString(res.note) && this.partner) {
            let text = (this.partner.Comment || "") + ((this.partner.Comment || "").length > 0 ? '\n' + res.note : res.note);
            this.partner.Comment = text;
        }

        this.cdRer.detectChanges();
    })
  }

  loadPartner(data: CheckConversationData) {
    data.Name = data.Name || data.Facebook_UserName;

    if(this.data) { // Cập nhật theo partner mapping
      data.Name = data.Name || this.data.name || data.Facebook_UserName;
      data.Facebook_ASUserId = data.Facebook_ASUserId || this.data.psid;
      data.Phone = data.Phone || this.data.phone;
      data.Street = data.Street || this.data.address;
    }

    let partnerId = data?.Id;
    if(partnerId) {
      this.loadPartnerRevenue(partnerId);
      this.loadBill(partnerId);
    }

    this.loadNotes(this.team.Facebook_PageId, data.Facebook_ASUserId);
    this.partnerService.onLoadOrderFromTabPartner$.emit(data);
  }

  // loadpartner(pageId: string, psid: string, partnerId?: number) {
  //   if(!TDSHelperString.hasValueString(pageId) || !TDSHelperString.hasValueString(psid)) {
  //     this.message.error(Message.ErrorOccurred);
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.partnerService.checkConversation(pageId, psid).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
  //     .subscribe((res: TabPartnerCvsRequestDTO) => {

  //       if(res?.Data && res?.Success) {
  //         res.Data.Name = res.Data.Name || res.Data.Facebook_UserName;

  //         if(this.data) { // Cập nhật theo partner mapping
  //             res.Data.Name = res.Data.Name || this.data.name || res.Data.Facebook_UserName;
  //             res.Data.Facebook_ASUserId = res.Data.Facebook_ASUserId || this.data.psid;
  //             res.Data.Phone = res.Data.Phone || this.data.phone;
  //             res.Data.Street = res.Data.Street || this.data.address;
  //         }

  //         // this.partner = res.Data;
  //         // this.updateForm(res.Data);

  //         partnerId = partnerId || res.Data?.Id;
  //         if(partnerId) {
  //           this.loadPartnerRevenue(partnerId);
  //           this.loadBill(partnerId);
  //         }

  //         this.loadNotes(pageId, psid);
  //         this.partnerService.onLoadOrderFromTabPartner$.emit(res.Data);
  //       }
  //       else {
  //         this.message.error(Message.ErrorOccurred);
  //       }
  //     }, error => {
  //       this.message.error('Check conversation đã xảy ra lỗi!');
  //     });
  // }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstPartnerStatus = [...res];
    }, error => {
        this.message.error(`${error?.error?.message}`)
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

  eventLoading() {
    this.conversationOrderFacade.isLoadingPartner$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isLoading = res;
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
    // model.psid = this.partner.Facebook_ASUserId;
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
    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.noteData.items = [...res.Items];
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load ghi chú khách hàng đã xảy ra lỗi');
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
    if(this.partner?.Id) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(this.partner.Id, data).subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        // this.partner.StatusText = status.text;
      });
    }
    else {
      this.message.error(Message.PartnerNotInfo);
    }
  }

  getStatusColor(statusText: string | undefined) {
    if(TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
      let value = this.lstPartnerStatus.find(x => x.text == statusText);
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
    let phone = this.partner?.Phone;
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
        this._form.controls.PhoneReport.setValue(true);
      }
    });
  }

  showModalListBlock() {
    let phone = this.partner?.Phone;
    let currentTeam = this.crmTeamService.getCurrentTeam();
    let phoneReport = this._form.value?.PhoneReport;

    const modal = this.modalService.create({
      title: 'Lịch sử chặn',
      content: ModalListBlockComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        phone: phone,
        psid: this.partner?.Facebook_ASUserId,
        accessToken: currentTeam?.Facebook_PageToken,
        facebookName: this.partner?.Facebook_UserName,
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
        // this.loadpartner(this.team?.Facebook_PageId, this.partner?.Facebook_ASUserId);
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

  createOrder() {
    this.onTabOrder.emit(true);
  }

  editBill(data:TDSSafeAny){
    this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  showPaymentModal(data:TDSSafeAny){
    this.fastSaleOrderService.getRegisterPayment({ids: [data.Id]}).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        delete res['@odata.context'];
        const modal = this.modalService.create({
          title: 'Đăng ký thanh toán',
          size:'lg',
          content: ModalPaymentComponent,
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            dataModel : res
          }
        });
        modal.afterClose.subscribe(result => {
          if(TDSHelperObject.hasValue(result)){
            this.loadBill(data.PartnerId);
          }
        });
      },
      err=>{
        this.message.error(err.error.message ?? 'Không tải được dữ liệu');
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
