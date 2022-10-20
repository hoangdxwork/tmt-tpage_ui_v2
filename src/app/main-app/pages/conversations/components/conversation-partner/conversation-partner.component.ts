import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { takeUntil } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO,PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
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
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { CsPartner_SuggestionHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-suggestion.handler';
import { CsPartner_PrepareModelHandler } from 'src/app/main-app/handler-v2/chatomni-cspartner/prepare-partner.handler';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniConversationInfoDto, ConversationPartnerDto, ConversationRevenueDto, Conversation_LastBillDto, GroupBy_ConversationBillDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ TDSDestroyService ]
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

  @Input() conversationInfo!: ChatomniConversationInfoDto | null;
  @Input() syncConversationInfo!: ChatomniConversationInfoDto;
  @Input() isLoading!: boolean;

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
  lastInvoice!: Conversation_LastBillDto;
  stateInvoices: GroupBy_ConversationBillDto[] = [];
  totalBill: number = 0;

  lstInvoice: Conversation_LastBillDto[] = [];
  tab_Bill?: any = null;
  isEditPartner: boolean = false;
  partner!: ConversationPartnerDto;
  conversationItem!: ChatomniConversationItemDto; // dữ liệu nhận từ conversation-all
  visibleDrawerBillDetail: boolean = false;
  tempPartner!: ConversationPartnerDto | any; // biến tạm khi thay đổi thông tin khách hàng nhưng không bấm lưu

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
    private postEvent: ConversationPostEvent,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private conversationDataFacade: ConversationDataFacade,
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
      this.loadNotes(this.team.ChannelId, this.conversationItem.ConversationId);
    }

    // TODO: update partner từ conversation realtime signalR
    this.loadUpdateInfoByConversation();
    this.loadPartnerStatus();
    this.eventEmitter();
  }

  eventEmitter(){
    // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
    this.onSelectOrderFromMessage();

    // TODO: load thông tin partner từ comment bài post 'comment-filter-all'
    this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
        if(TDSHelperObject.hasValue(res)) {
          this.loadData(res);

          // TODO: gán sự kiện loading cho tab conversation-post
          this.postEvent.spinLoadingTab$.emit(false);
        }
      }
    })

    //TODO: Cập nhật địa chỉ từ tds-conversation-item-v2 khi lưu chọn địa chỉ
    this.omniEventEmiter.selectAddressEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: ResultCheckAddressDTO)=>{
          let partner = this.csPartner_SuggestionHandler.onLoadSuggestion(result, this.partner);
          this.partner = partner;
          this.mappingAddress(this.partner);
          this.cdRef.detectChanges();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        let x = {...changes["conversationInfo"].currentValue} as ChatomniConversationInfoDto;
        this.loadData(x);
        this.loadNotes(this.team.ChannelId, this.conversationItem.ConversationId);
    }

    if(changes['syncConversationInfo'] && !changes['syncConversationInfo'].firstChange) {
        let data = {...changes['syncConversationInfo'].currentValue} as ChatomniConversationInfoDto;
        this.onSyncConversationInfo(data);
        this.cdRef.detectChanges();
    }
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();
    this.conversationInfo = {...conversationInfo};

    this.onSyncConversationInfo(this.conversationInfo);
    this.cdRef.detectChanges();
  }

  onSyncConversationInfo(conversationInfo: ChatomniConversationInfoDto) {
    // TODO: gán thông tin khách hàng
    if(this.team && conversationInfo) {
        this.partner = {...this.csPartner_PrepareModelHandler.getPartnerFromConversation(conversationInfo, this.team)};
        this.mappingAddress(this.partner);
    }

    if(this.team && conversationInfo.Conversation) {
        this.conversationItem = {...conversationInfo.Conversation};
    }

    if(conversationInfo.Bill && conversationInfo.Bill.LastBill) {
        this.lastInvoice = {...conversationInfo.Bill.LastBill}
    }

    if(conversationInfo.Bill && conversationInfo.Bill.Data) {
        this.totalBill = 0;

        this.stateInvoices = [...conversationInfo.Bill.Data];
        this.stateInvoices.map(x => this.totalBill = this.totalBill + x.Total);

        this.stateInvoices.map(x => {
          switch(x.Type) {
              case 'open':
                x.Name = 'Đã xác nhận';
                break;
              case 'paid':
                x.Name = 'Đã thanh toán';
                break;
              case 'cancel':
                x.Name = 'Hủy bỏ';
                break;
              case 'draft':
                x.Name = 'Nháp';
                break;
          }
        })
        this.stateInvoices = [...this.stateInvoices];
    }

    if(conversationInfo.Revenue) {
        this.revenue = {...conversationInfo.Revenue};
    }
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
      this.cdRef.detectChanges();
    })
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {
        switch (obs.type) {
          case 'phone':
            this.partner.Phone = obs.value;
          break;
          case 'address':
            this.partner.Street = obs.value;
          break;
          case 'note':
            let text = (this.partner.Comment || "") + ((this.partner.Comment || "").length > 0 ? '\n' + obs.value : obs.value);
            this.partner.Comment = text;
          break;
        }

        // TODO: trường hợp không có đơn hàng
        let id = this.partner.Id;
        if(!id || id == 0) {
            this.notiOrderFromMessage(obs.type);
            this.cdRef.detectChanges();
            return;
        }

        if(this.conversationInfo && this.team) {
          // this.isLoading = true;
          // let model = {...this.csPartner_PrepareModelHandler.prepareModel(this.partner, this.conversationItem)};

          // this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: this.team.Id }).pipe(takeUntil(this.destroy$)).subscribe({
          //   next: (res: any) => {
          //       this.isLoading = false;
          //       this.notiOrderFromMessage(obs.type);
          //       if(this.isEditPartner) {
          //         this.tempPartner = {...this.partner}
          //       }
          //       this.cdRef.detectChanges();
          //   },
          //   error: (error: any) => {
          //       this.isLoading = false;
          //       this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
          //       this.cdRef.detectChanges();
          //   }
          // });
        }
      }
    })
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstPartnerStatus = [...res];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
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
          this.cdRef.detectChanges();
      },
      error: (error :any) => {
          this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
          }
      })
  }

  loadNotes(page_id: string, psid: string) {
    this.noteData = { items: [] };

    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.noteData.items = [...this.noteData.items, ...res?.Items];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load ghi chú khách hàng đã xảy ra lỗi');
      }
    });
  }

  removeNote(id: any, index: number) {
    if(!id)  return;

    this.conversationService.deleteNote(id).pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          if (this.noteData.items[index]?.id === id) {
              this.noteData.items.splice(index, 1);
              this.message.success('Xóa ghi chú thành công');
          }

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  onChangeTabBill(event: any, item: GroupBy_ConversationBillDto) {
      this.tab_Bill = event;
      this.lstInvoice = [];

      let partnerId = this.partner.Id;
      let state = item.Type;

      if(partnerId && state) {
        this.isLoading = true;
        this.partnerService.getInvoice(partnerId, state).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.lstInvoice =  [...res];
                this.isLoading = false;
                this.cdRef.detectChanges();
            },
            error: (error: any) => {
                this.isLoading = false;
                this.message.error(`${error?.error?.message}`);
                this.cdRef.detectChanges();
            }
        })
      }
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
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác thất bại');
            this.cdRef.detectChanges();
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

    if(this.partner){
      this.tempPartner = {...this.partner};
    }
  }

  onCancelEdit() {
    this.isEditPartner = false;

    if(this.tempPartner) {
      this.partner = {...this.tempPartner};
    }
  }

  onSaveEdit() {
    let model = this.prepareModel();
    let teamId = this.team.Id;
    if(!model.Name) {
      this.message.error('Vui lòng nhập tên khách hàng');
      return
    }

    this.isLoading = true;
    this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: teamId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          delete res['@odata.context'];
          this.message.success('Cập nhật khách hàng thành công');

          // TODO: gọi sự kiện đồng bộ dữ liệu qua conversation-all, conversation-post, đẩy xuống ngOnChanges
          let csid = res.FacebookPSId;
          this.chatomniConversationFacade.onSyncConversationInfo$.emit(csid);

          this.isEditPartner = false;
          this.isLoading = false
          delete this.tempPartner;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false
          this.isEditPartner = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
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
    this.fastSaleOrderService.getRegisterPayment({ids: [data.Id]}).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
          delete res['@odata.context'];
          this.modalService.create({
              title: 'Đăng ký thanh toán',
              size:'lg',
              content: ModalPaymentComponent,
              viewContainerRef: this.viewContainerRef,
              componentParams: {
                  dataModel : res
              }
          });
        }
      },
      error: (error: any) => {
        this.message.error(error.error.message ?? 'Không tải được dữ liệu');
      }
    })
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
        _street: this.partner.Street || '',
        isSelectAddress: true
      }
    });

  modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
    next: (result: ResultCheckAddressDTO) => {
      if(result){
          this.partner = {...this.csPartner_SuggestionHandler.onLoadSuggestion(result, this.partner)};
          this.mappingAddress(this.partner);
      }
      this.cdRef.detectChanges();
    }
  })
  }

  checkAddressByPhone() {
    let phone = this.partner.Phone;
    if (TDSHelperString.hasValueString(phone)) {

      this.commonService.checkAddressByPhone(phone)
        .pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (res: any) => {
              this.message.info('Chưa có dữ liệu');
            },
            error: error => {
              this.message.error(`${error?.error?.message}`)
            }
          })
    }
  }

  notiOrderFromMessage(type: string) {
    switch (type) {
      case 'phone':
        this.message.info('Chọn làm số điện thoại thành công');
      break;
      case 'address':
        this.message.info('Chọn làm địa chỉ thành công');
      break;
      case 'note':
        this.message.info('Chọn làm ghi chú thành công');
      break;
    }
  }

  validateData() {
    this.isEditPartner = false;
    this.conversationInfo = null;
    (this.partner as any) = null;
    (this.revenue as any) = null;
    (this.lastInvoice as any) = null;
    (this.stateInvoices as any) = null;
    this.lstInvoice = [];
    this.totalBill = 0;
    (this._cities as any) = null;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
    delete this.tempPartner;
  }

}
