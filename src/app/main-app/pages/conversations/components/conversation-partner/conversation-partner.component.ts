import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { takeUntil } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO,PartnerStatusDTO, ResRevenueCustomerDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTagStatusType } from 'tds-ui/tag';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { ModalBlockPhoneComponent } from '../modal-block-phone/modal-block-phone.component';
import { ModalListBlockComponent } from '../modal-list-block/modal-list-block.component';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { CreateOrUpdatePartnerModel } from 'src/app/main-app/dto/conversation-partner/create-update-partner.dto';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { CsPartner_SuggestionHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-suggestion.handler';
import { CsPartner_PrepareModelHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-partner.handler';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { ChatomniConversationInfoDto, ConversationPartnerDto, ConversationRevenueDto, Conversation_LastBillDto, GroupBy_ConversationBillDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { QuickSaleOnlineOrderModel } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    providers: [ TDSDestroyService ]
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  @Input() conversationInfo!: ChatomniConversationInfoDto | null;
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;

  @Output() onTabOderOutput = new EventEmitter<boolean>();

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  revenue!: ConversationRevenueDto;
  noteData: any = { items: [] };

  lstPartnerStatus!: Array<PartnerStatusDTO>;
  innerNote!: string;
  lastBill!: Conversation_LastBillDto;
  lstBill: GroupBy_ConversationBillDto[] = [];
  totalBill: number = 0;

  tab_Bill: number = 0;
  isEditPartner: boolean = false;
  partner!: ConversationPartnerDto;
  conversationItem!: ChatomniConversationItemDto; // dữ liệu nhận từ conversation-all
  isLoading: boolean = false;
  visibleDrawerBillDetail: boolean = false;

  constructor(private message: TDSMessageService,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private crmMatchingService: CRMMatchingService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private cdRef: ChangeDetectorRef,
    private conversationDataFacade: ConversationDataFacade,
    private chatomniConversationService: ChatomniConversationService,
    private csPartner_SuggestionHandler: CsPartner_SuggestionHandler,
    private csPartner_PrepareModelHandler: CsPartner_PrepareModelHandler,
    private conversationOrderFacade: ConversationOrderFacade,
    private destroy$: TDSDestroyService,
    private router: Router,
    private omniEventEmiter: ChatomniEventEmiterService) {
  }

  ngOnInit(): void  {
    if(this.conversationInfo) {
        this.loadData(this.conversationInfo);
    }

    // TODO: load lại form conversation-partner từ conversation-order
    this.loadPartnerFromTabOrder();

    // TODO: update partner từ conversation realtime signalR
    this.loadUpdateInfoByConversation();

    // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
    this.onSelectOrderFromMessage();
    this.loadPartnerStatus();

    this.eventEmitter();
  }

  eventEmitter(){
    // TODO: load thông tin partner từ comment bài post 'comment-filter-all'
    this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
          if(TDSHelperObject.hasValue(res)) {
              this.loadData(res);
          }
      }
    })

    //TODO: Cập nhật địa chỉ từ tds-conversation-item-v2 khi lưu chọn địa chỉ
    this.omniEventEmiter.selectAddressEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: ResultCheckAddressDTO)=>{
        let partner = this.csPartner_SuggestionHandler.onLoadSuggestion(result, this.partner);
          this.partner = partner;
          this.mappingAddress(this.partner);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        let x = {...changes["conversationInfo"].currentValue} as ChatomniConversationInfoDto;
        this.loadData(x);
    }
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();
    this.conversationInfo = {...conversationInfo};

    // TODO: gán thông tin khách hàng
    if(this.team && conversationInfo) {
        this.partner = {...this.csPartner_PrepareModelHandler.getPartnerFromConversation(conversationInfo, this.team)};
        this.mappingAddress(this.partner);
    }

    if(this.team && conversationInfo.Conversation) {
        this.conversationItem = {...conversationInfo.Conversation};
        this.loadNotes(this.team.ChannelId, this.conversationItem.ConversationId);
    }

    if(conversationInfo && conversationInfo.Bill && conversationInfo.Bill.LastBill) {
        this.lastBill = {...conversationInfo.Bill.LastBill}
    }

    if(conversationInfo && conversationInfo.Bill && conversationInfo.Bill.Data) {
        this.totalBill = 0;
        this.lstBill = [...conversationInfo.Bill.Data];
        this.lstBill.map(x => {
          this.totalBill = this.totalBill + x.Total;
        })
    }

    if(conversationInfo && conversationInfo.Revenue) {
        this.revenue = {...conversationInfo.Revenue};
    }

    this.cdRef.detectChanges();
  }

  loadPartnerFromTabOrder() {
    this.partnerService.onLoadPartnerFromTabOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (order: QuickSaleOnlineOrderModel) => {
        if(order) {
          let partner = {...this.csPartner_PrepareModelHandler.loadPartnerFromTabOrder(this.partner, order)};
          this.partner = partner;
        }
      }
    });
  }

  loadUpdateInfoByConversation() {
    this.conversationDataFacade.onUpdateInfoByConversation$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res) {
          if(TDSHelperString.hasValueString(res.phone) && this.partner){
              this.partner.Phone = res.phone;
          }
          if(TDSHelperString.hasValueString(res.address) && this.partner){
              this.partner.Street = res.address;
          }
      }
    })
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe(res => {

        if(res && TDSHelperString.hasValueString(res.phone) && this.partner) {
            this.partner.Phone = res.phone;
        }
        if(res && TDSHelperString.hasValueString(res.address) && this.partner) {
            this.partner.Street = res.address;
        }
        if(res && TDSHelperString.hasValueString(res.note) && this.partner) {
          let exist = (this.partner.Comment || "" as string).includes(res.note)
          if(!exist){
            let text = (this.partner.Comment || "") + ((this.partner.Comment || "").length > 0 ? '\n' + res.note : res.note);
            this.partner.Comment = text;
            this.message.info("Chọn làm ghi chú thành công");
          } else {
            this.message.info('Ghi chú đã được chọn');
          }

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

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    let partner = {...this.csPartner_SuggestionHandler.onLoadSuggestion(item, this.partner)};
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
    model.psid = this.conversationItem.ConversationId;

    this.isLoading = true;
    this.crmMatchingService.addNote(model.psid, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
              this.innerNote = '';
              this.message.success('Thêm ghi chú thành công');
              this.noteData.items = [...[res], ...this.noteData.items];
          }

          this.isLoading = false;
      },
      error: (error :any) => {
          this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          }
      })
  }

  loadNotes(page_id: string, psid: string) {
    this.noteData = { items: [] };

    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
              this.noteData.items = [...this.noteData.items, ...res.Items];
          }
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load ghi chú khách hàng đã xảy ra lỗi');
      }
    });
  }

  removeNote(id: any, index: number) {
    this.conversationService.deleteNote(id).pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          if (this.noteData.items[index].id === id) {
              this.noteData.items.splice(index, 1);
          }
          this.message.success('Xóa ghi chú thành công');
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      }
    })
  }

  onChangeTabBill(event: any) {
      this.tab_Bill = event;
  }

  selectStatus(event: PartnerStatusDTO) {
    if(this.partner?.Id && event) {
      let data = {
          status: `${event.value}_${event.text}`
      }

      this.partnerService.updateStatus(this.partner.Id, data).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
            this.message.success('Cập nhật trạng thái khách hàng thành công');
            this.partner.StatusText = event.text;
        },
        error: (error: any) => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác thất bại');
        }
      });
    }
  }

  getStatusColor(statusText: string | undefined) {
    if(TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
        let value = this.lstPartnerStatus.find(x => x.text == statusText);
        if(value) return value.value;
        else return '#28A745';
    }
    else return '#28A745';
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
        psid: this.partner?.FacebookASIds || this.partner.FacebookPSId,
        accessToken: currentTeam?.ChannelToken,
        facebookName: this.partner?.Name,
        isReport: phoneReport
      }
    });

    modal.componentInstance?.changeReportPartner.subscribe({
      next: (res: any) => {
        this.partner.PhoneReport = res;
     }
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
    this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: teamId }).pipe(takeUntil(this.destroy$)).subscribe(res => {

        delete res['@odata.context'];
        this.message.success('Cập nhật khách hàng thành công');

        let x = { ... res} as CreateOrUpdatePartnerModel;

        // TODO: kiểm tra số điện thoại
        let phone = x.Phone as string;

        // Xử lý meger map để để gán lên trên
        if(TDSHelperString.hasValueString(phone)) {
          this.crmMatchingService.checkPhoneReport(phone).pipe(takeUntil(this.destroy$)).subscribe({
            next: (obs) => {
              this.partner.PhoneReport = obs.is_report;
            },
            error: (error: any) => {
              this.message.error(`${error?.error?.message}`);
            }
          })
        }

        let partnerUpdate = {...this.csPartner_PrepareModelHandler.updatePartnerModel(this.partner, x)};
        if(partnerUpdate && this.conversationInfo) {
            this.partner = {...partnerUpdate};
            this.conversationInfo.Partner = {...partnerUpdate};
        }

        // cập nhật dữ liệu khách hàng sang form conversation-order
        // Chỗ này chưa xử lý bên order
        this.partnerService.onLoadOrderFromTabPartner$.emit(this.partner);

        this.isEditPartner = false;
        this.isLoading = false

    }, error => {
        this.isLoading = false
        this.isEditPartner = false;
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
    });
  }

  prepareModel() {
    let model = {...this.csPartner_PrepareModelHandler.prepareModel(this.partner, this.conversationItem)};
    return model;
  }

  editBill(data: Conversation_LastBillDto){
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
                  // Xử lý lại chỗ này
                  // this.loadPartnerBill(data.PartnerId);
              }
          });
        }
      }, error =>{
          this.message.error(error.error.message ?? 'Không tải được dữ liệu');
      }
    )
  }

  onTabOrder(){
    this.onTabOderOutput.emit(true);
  }

  mappingAddress(partner: ConversationPartnerDto) {
    let data = {...this.csPartner_SuggestionHandler.mappingAddress(partner)};

    this._cities = data._cities;
    this._districts = data._districts;
    this._wards = data._wards;
    this._street = data._street;
  }

  showModalSuggestAddress(){
    let modal =  this.modalService.create({
      title: 'Sửa địa chỉ',
      content: ModalAddAddressV2Component,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _cities : this._cities,
        _districts: this._districts,
        _wards: this._wards,
        _street: this._street,
        isSelectAddress: true
      }
    });

  modal.afterClose.subscribe({
    next: (result: ResultCheckAddressDTO) => {
      if(result){
        let partner = {...this.csPartner_SuggestionHandler.onLoadSuggestion(result, this.partner)};
        this.partner = partner;
        this.mappingAddress(this.partner);
      }
    }
  })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateData() {
    this.isEditPartner = false;
    this.conversationInfo = null;
    (this.partner as any) = null;
    (this.revenue as any) = null;
    (this.lastBill as any) = null;
    (this.lstBill as any) = null;
    this.totalBill = 0;
    (this._cities as any) = null;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
  }

}
