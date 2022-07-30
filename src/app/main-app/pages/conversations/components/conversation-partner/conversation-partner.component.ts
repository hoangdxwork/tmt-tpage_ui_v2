import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO,PartnerStatusDTO, ResRevenueCustomerDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ConversationOrderBillByPartnerResultDTO } from 'src/app/main-app/dto/conversation/conversation.dto';
import { ViewConversation_FastSaleOrdersDTO } from 'src/app/main-app/dto/fastsaleorder/view_fastsaleorder.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TabPartnerCvsRequestDTO, TabPartnerCvsRequestModel } from 'src/app/main-app/dto/conversation-partner/partner-conversation-request.dto';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { ModalBlockPhoneComponent } from '../modal-block-phone/modal-block-phone.component';
import { ModalListBlockComponent } from '../modal-list-block/modal-list-block.component';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { CreateOrUpdatePartnerModel } from 'src/app/main-app/dto/conversation-partner/create-update-partner.dto';
import { QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { CrmMatchingV2Detail } from 'src/app/main-app/dto/conversation-all/crm-matching-v2/crm-matching-v2.dot';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { CsPartner_SuggestionHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-suggestion.handler';
import { CsPartner_PrepareModelHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-partner.handler';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniConversationItemDto; // dữ liệu nhận từ conversation-all
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  dataModel!: ChatomniConversationItemDto; // dùng gán lại this.data input
  objRevenue!: ResRevenueCustomerDTO;
  noteData: any = { items: [] };
  destroy$ = new Subject<void>();

  // partner!: ActiveMatchingPartner;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  innerNote!: string;
  totalBill: number = 0;
  lastSaleOrder!: ViewConversation_FastSaleOrdersDTO;
  lstBill: ConversationOrderBillByPartnerResultDTO[] = [];

  tabBillCurrent: number = 0;
  isEditPartner: boolean = false;
  partner!: TabPartnerCvsRequestModel;
  isLoading: boolean = false;

  constructor(private message: TDSMessageService,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private modalService: TDSModalService,
    private crmMatchingService: CRMMatchingService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private conversationDataFacade: ConversationDataFacade,
    private csPartner_SuggestionHandler: CsPartner_SuggestionHandler,
    private csPartner_PrepareModelHandler: CsPartner_PrepareModelHandler,
    private conversationOrderFacade: ConversationOrderFacade,
    private router: Router) {
  }

  ngOnInit(): void  {
    if(this.data) {
      this.dataModel = this.data;

      let psid = this.dataModel?.ConversationId;
      let pageId = this.team.ChannelId;
      this.loadData(pageId, psid);
    }

    // TODO: load lại form conversation-partner từ conversation-order
    this.loadPartnerFromTabOrder();

    // TODO: load lại form conversation-partner từ comment bài post
    this.loadPartnerByPostComment();

    // TODO: update partner từ conversation realtime signalR
    this.loadUpdateInfoByConversation();

    // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
    this.onSelectOrderFromMessage();

    this.loadPartnerStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        let x = {...changes["data"].currentValue} as ChatomniConversationItemDto;

        if(TDSHelperObject.hasValue(x) && x.Id) {

            this.dataModel = x;

            let psid = this.dataModel.ConversationId;
            let pageId = this.team.ChannelId;
            this.loadData(pageId, psid);
        }
    }
  }

  loadData(pageId: string, psid: string) {

    // TODO: dữ liệu chính gán cho partner
    this.checkConversation(pageId, psid);
    this.loadNotes(pageId, psid);

    let partnerId = this.dataModel?.PartnerId;
    if(partnerId) {
        this.loadPartnerBill(partnerId);
        this.loadPartnerRevenue(partnerId);
    }
  }

  checkConversation(pageId: string, psid: string): any {
    if(!TDSHelperString.hasValueString(pageId)) {
        return this.message.error('Không tìm thấy Facebook_PageId');
    }
    if(!TDSHelperString.hasValueString(psid)) {
        return this.message.error('Không tìm thấy psid');
    }

    (this.partner as any) = null;
    this.isLoading = true;

    this.partnerService.checkConversation(pageId, psid).pipe(takeUntil(this.destroy$),
        finalize(() => { this.isLoading = false })).subscribe((res: TabPartnerCvsRequestDTO) => {

            if(res?.Data && res?.Success) {
                let x = { ... res.Data} as TabPartnerCvsRequestModel;

                x.Facebook_ASUserId = x.Facebook_ASUserId || this.dataModel?.Id;
                x.Name = x.Name || x.Facebook_UserName ||  this.dataModel?.Name;
                x.Phone = x.Phone || this.dataModel?.Phone;
                x.Street = x.Street;

                // TODO: 2 field gán thêm để mapping qua conversation-order, xem cmt dto
                x.page_id = pageId;
                x.psid = psid;

                this.partner = x;

                this.mappingAddress(this.partner);
                this.partnerService.onLoadOrderFromTabPartner$.emit(this.partner);

                this.cdRef.detectChanges();
            }
        }, error => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        })
  }

  loadPartnerFromTabOrder() {
    this.isLoading = true;
    this.partnerService.onLoadPartnerFromTabOrder$.pipe(takeUntil(this.destroy$), finalize(() => { this.isLoading = false }))
      .subscribe((res: QuickSaleOnlineOrderModel) => {

          let partner = this.csPartner_PrepareModelHandler.loadPartnerFromTabOrder(this.partner, res);
          this.partner = partner;
      });
  }

  loadPartnerByPostComment() {
    this.isLoading = true;
    this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$),
      finalize(() => { this.isLoading = false })).subscribe(res => {
        if(res) {
            let pageId = this.team.ChannelId;
            let psid = res.psid;

            this.checkConversation(pageId, psid);
        }
    });
  }

  loadUpdateInfoByConversation() {
    this.isLoading = true;
    this.conversationDataFacade.onUpdateInfoByConversation$.pipe(takeUntil(this.destroy$),
      finalize(() => { this.isLoading = false })).subscribe(res => {
        if(res) {
            if(!TDSHelperString.hasValueString(this.partner?.Phone) && res.has_phone && TDSHelperString.hasValueString(res.phone) && this.partner){
                this.partner.Phone = res.phone;
            }
            if(!TDSHelperString.hasValueString(this.partner?.Street) && res.has_address && TDSHelperString.hasValueString(res.address) && this.partner){
                this.partner.Street = res.address;
            }
        }
    })
  }

  onSelectOrderFromMessage() {
    this.isLoading = true;
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$),
      finalize(() => { this.isLoading = false })).subscribe(res => {

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
    })
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstPartnerStatus = [...res];
    }, error => {
        this.message.error(`${error?.error?.message}`)
    });
  }

  loadPartnerRevenue(partnerId: number){
    this.partnerService.getPartnerRevenueById(partnerId).pipe(takeUntil(this.destroy$),
      finalize(() => this.cdRef.markForCheck())).subscribe(res => {
        if(res){
            this.objRevenue = res;
        }
    }, error => {
        this.message.error(`${error?.error?.message}`);
    });
  }

  loadPartnerBill(partnerId: number) {
    this.fastSaleOrderService.getConversationOrderBillByPartner(partnerId).pipe(takeUntil(this.destroy$),
      finalize(() => this.cdRef.markForCheck())).subscribe(res => {
        if(res) {
            this.lstBill = res.Result;
            this.totalBill = res.Total;
            this.lastSaleOrder = res.LastSaleOrder;
        }
      }, error => {
          this.message.error(`${error?.error?.message}`);
      });
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    let partner = this.csPartner_SuggestionHandler.onLoadSuggestion(item, this.partner);
    this.partner = partner;
  }

  addNote() {
    if(!TDSHelperString.hasValueString(this.innerNote)) {
        this.message.error('Hãy nhập nội dung ghi chú');
        return;
    }

    let model = {} as MDBFacebookMappingNoteDTO;
    model.message = this.innerNote;
    model.page_id = this.team?.ChannelId;
    model.psid = this.dataModel.ConversationId;

    this.isLoading = true;
    this.crmMatchingService.addNote(model.psid, model).pipe(takeUntil(this.destroy$),
       finalize(() => { this.isLoading = false;  this.cdRef.markForCheck() })).subscribe(res => {
       if(res) {
            this.innerNote = '';
            this.message.success('Thêm ghi chú thành công');
            this.noteData.items = [...[res], ...this.noteData.items];
       }

      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
  }

  loadNotes(page_id: string, psid: string) {
    this.noteData = { items: [] };

    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res) {
            this.noteData.items = [...this.noteData.items, ...res.Items];
        }
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load ghi chú khách hàng đã xảy ra lỗi');
    });
  }

  removeNote(id: any, index: number) {
    this.conversationService.deleteNote(id).pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$),
      finalize(() => this.cdRef.markForCheck())).subscribe(() => {

        if (this.noteData.items[index].id === id) {
            this.noteData.items.splice(index, 1);
        }
        this.message.success('Xóa ghi chú thành công');

    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  onChangeBill(event: any) {
      this.tabBillCurrent = event;
  }

  selectStatus(event: PartnerStatusDTO) {
    if(this.partner?.Id && event) {
      let data = {
          status: `${event.value}_${event.text}`
      }

      this.partnerService.updateStatus(this.partner.Id, data).pipe(takeUntil(this.destroy$),
        finalize(() => this.cdRef.markForCheck())).subscribe(res => {
          if(res) {
              this.message.success('Cập nhật trạng thái khách hàng thành công');
              this.partner.StatusText = event.text;
          }
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác thất bại');
      });
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

  onBlockPhone() {
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
        this.partner.PhoneReport = true;
      }
    });
  }

  onlListPhoneBlock() {
    let phone = this.partner?.Phone;
    let currentTeam = this.team;
    let phoneReport = this.partner.PhoneReport;

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
      this.partner.PhoneReport = res;
    });
  }

  onEditPartner() {
    this.isEditPartner = !this.isEditPartner;
  }

  onCancelEdit() {
    this.isEditPartner = false;
  }

  onSaveEdit() {
    let model = this.prepareModel();
    let teamId = this.team.Id;

    this.isLoading = true;
    this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: teamId })
      .pipe(takeUntil(this.destroy$), finalize(() => { this.isLoading = false })).subscribe(res => {

          delete res['@odata.context'];
          this.message.success('Cập nhật khách hàng thành công');

          let x = { ... res} as CreateOrUpdatePartnerModel;

          // TODO: kiểm tra số điện thoại
          let phone = x.Phone as string;
          if(TDSHelperString.hasValueString(phone)) {
            this.crmMatchingService.checkPhoneReport(phone).pipe(takeUntil(this.destroy$)).subscribe((obs) => {
                // TODO: gán phoneReport
                if(obs && obs.is_report == true && this.partner) {
                    this.partner.PhoneReport = true;
                } else {
                    this.partner.PhoneReport = false;
                }

            }, error => {
                this.message.error(`${error?.error?.message}`);
            })
          }

          let partner = this.csPartner_PrepareModelHandler.updatePartnerModel(this.partner, x);
          this.partner = partner;

          // cập nhật dữ liệu khách hàng sang form conversation-order
          this.partnerService.onLoadOrderFromTabPartner$.emit(this.partner);
          this.isEditPartner = false;

          this.cdRef.markForCheck();

      }, error => {
          this.isEditPartner = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      });
  }

  prepareModel() {
    let model = this.csPartner_PrepareModelHandler.prepareModel(this.partner, this.dataModel);
    return model;
  }

  editBill(data:TDSSafeAny){
    this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  showPaymentModal(data: TDSSafeAny){
    this.fastSaleOrderService.getRegisterPayment({ids: [data.Id]}).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if(res) {
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

          modal.afterClose.subscribe((obs) => {
              if(obs == 'onLoadPage') {
                  this.loadPartnerBill(data.PartnerId);
              }
          });
        }
      }, error =>{
          this.message.error(error.error.message ?? 'Không tải được dữ liệu');
      }
    )
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  mappingAddress(partner: TabPartnerCvsRequestModel) {
    let data = this.csPartner_SuggestionHandler.mappingAddress(partner);

    this._cities = data._cities;
    this._districts = data._districts;
    this._wards = data._wards;
    this._street = data._street;
  }

}
