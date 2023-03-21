import { OnDestroy } from '@angular/core';
import { Observable, delay, finalize, BehaviorSubject } from 'rxjs';
import { PartnerChangeStatusDTO } from './../../../../dto/partner/partner-status.dto';
import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { map, takeUntil } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { MDBFacebookMappingNoteDTO, StatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
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
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { SuggestAddressDto, SuggestAddressService } from '@app/services/suggest-address.service';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TDSDestroyService]
})

export class ConversationPartnerComponent implements OnInit, OnChanges , OnDestroy {

  @Input() conversationInfo!: ChatomniConversationInfoDto | any;
  @Input() team!: CRMTeamDTO | any;
  @Input() type!: string;
  @Input() isLoading: boolean = false;

  @Output() onTabOderOutput = new EventEmitter<boolean>();

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  revenue!: ConversationRevenueDto;
  noteData: any = { items: [] };

  lstPartnerStatus!: Array<StatusDTO>;
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

  onSyncTimer: any;

  suggestData: Observable<any> = new Observable<any>();
  suggestText: any;
  suggestCopy: any;
  isSuggestion: boolean = false;
  suggestTimer: TDSSafeAny;
  isLoadingAddress: boolean = false;

  private citySubject = new BehaviorSubject<SuggestCitiesDTO[]>([]);
  private districtSubject = new BehaviorSubject<SuggestDistrictsDTO[]>([]);
  private wardSubject = new BehaviorSubject<SuggestWardsDTO[]>([]);

  lstCity: Array<SuggestCitiesDTO> = [];
  lstDistrict: Array<SuggestDistrictsDTO> = [];
  lstWard: Array<SuggestWardsDTO> = [];

  constructor(private message: TDSMessageService,
    private conversationService: ConversationService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private suggestService: SuggestAddressService,
    private crmMatchingService: CRMMatchingService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private cdRef: ChangeDetectorRef,
    private postEvent: ConversationPostEvent,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private chatomniCommentFacade: ChatomniCommentFacade,
    private csPartner_SuggestionHandler: CsPartner_SuggestionHandler,
    private csPartner_PrepareModelHandler: CsPartner_PrepareModelHandler,
    private conversationOrderFacade: ConversationOrderFacade,
    private destroy$: TDSDestroyService,
    private router: Router,
    private chatomniConversationService: ChatomniConversationService) {
  }

  ngOnInit(): void  {
    if(this.conversationInfo) {
      this.loadData(this.conversationInfo);
      this.loadNotes(this.team.ChannelId, this.conversationItem.ConversationId);
    }

    this.loadPartnerStatus();
    this.eventEmitter();
  }

  eventEmitter(){
    this.onSelectOrderFromMessage();
    this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
        if(res) {
            this.loadData(res);
            this.loadNotes(this.team.ChannelId, res.Conversation?.ConversationId);
            this.postEvent.spinLoadingTab$.emit(false);
        }
      }
    });

    this.chatomniConversationFacade.onSyncConversationPartner$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (info: ChatomniConversationInfoDto) => {
          this.loadData(info);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        let x = {...changes["conversationInfo"].currentValue} as ChatomniConversationInfoDto;
        this.loadData(x);
        this.loadNotes(this.team.ChannelId, this.conversationItem.ConversationId);
    }
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();
    this.isLoading = true;
    this.conversationInfo = {...conversationInfo};

    this.prepareModelPartner(this.conversationInfo);
    this.isLoading = false;
    this.cdRef.detectChanges();
  }

  prepareModelPartner(conversationInfo: ChatomniConversationInfoDto) {
    if(this.team && conversationInfo) {
        this.partner = {...this.csPartner_PrepareModelHandler.getPartnerFromConversation(conversationInfo, this.team)};
        this.mappingAddress(this.partner);
        this.suggestText = this.partner.Street;
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

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (obs: any) => {
          switch (obs.type) {
              case 'phone':
                this.partner.Phone = obs.value;
              break;
              case 'address':
                if(obs.value && TDSHelperObject.hasValue(obs.value)) {
                  let partner = this.csPartner_SuggestionHandler.onLoadSuggestion(obs.value, this.partner);
                  this.partner = partner;
                  this.mappingAddress(this.partner);
                  this.suggestText = this.partner.Street;
                  this.cdRef.detectChanges();
                }
              break;
              case 'note':
                let text = (this.partner.Comment || "") + ((this.partner.Comment || "").length > 0 ? '\n' + obs.value : obs.value);
                this.partner.Comment = text;
              break;
          }

          this.updatePartner(obs.type);
        }
    })
  }

  updatePartner(type: string) {
    if(this.conversationInfo && this.team) {
      this.isLoading = true;
      let model = {...this.csPartner_PrepareModelHandler.prepareModel(this.partner, this.conversationItem)};

      this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: this.team.Id }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.notiOrderFromMessage(type);

            if(this.isEditPartner) {
              this.tempPartner = {...this.partner}
            }

            let csid = res.FacebookPSId || res.FacebookASIds;
            this.onSyncConversationOrder(csid);

            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error?.error?.message);
            this.cdRef.detectChanges();
        }
      });
    }
  }

  loadPartnerStatus() {
    this.commonService.setPartnerStatus();
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: StatusDTO[]) => {
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
          this.cdRef.detectChanges();
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

  selectStatus(event: StatusDTO) {
    if(this.partner && this.partner.Id && event) {
      let data = {
        status: `${event.value}_${event.text}`
      }

      this.isLoading = true;
      this.partnerService.updateStatus(this.partner.Id, data).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
            this.message.success('Cập nhật trạng thái khách hàng thành công');
            this.partner.StatusText = event.text;

            let status = {
              UserId: this.conversationItem.UserId,
              Code: event.value,
              Name: event.text
            } as PartnerChangeStatusDTO;

            // TODO: cập nhật thông tin trạng thái cho conversation-all, tds-conversation
            this.partnerService.changeStatusFromPartner$.emit(status);

            if(this.conversationInfo && this.conversationInfo.Partner) {
              this.conversationInfo.Partner.StatusText = event.text;
              this.conversationInfo.Partner.StatusStyle = event.value;
              this.chatomniCommentFacade.onSyncPartnerTimeStamp$.emit(this.conversationInfo);
            }

            this.isLoading = false;
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

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
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

    modal.componentInstance?.changeReportPartner.pipe(takeUntil(this.destroy$)).subscribe({
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
      return;
    }

    this.isLoading = true;
    this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: teamId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.message.success('Cập nhật khách hàng thành công');

          let csid = res.FacebookPSId || res.FacebookASIds;
          this.onSyncConversationOrder(csid);

          this.isEditPartner = false;
          this.isLoading = false;
          this.suggestText = res.Street;
          this.suggestCopy = res.Street;
          this.isSuggestion = false;

          delete this.tempPartner;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false
          this.isEditPartner = false;
          this.message.error(error?.error?.message);
          this.cdRef.detectChanges();
      }
    });
  }

  onSyncConversationOrder(csid: any) {
    this.destroyTimer();
    this.onSyncTimer = setTimeout(() => {
      this.chatomniConversationService.getInfo(this.team.Id, csid).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (info: ChatomniConversationInfoDto) => {

            if((this.partner?.Id == 0 || this.partner?.Id == null) && info.Partner) {
              this.partner = info.Partner;
              this.cdRef.detectChanges();
            }

            this.chatomniConversationFacade.onSyncConversationOrder$.emit(info);
            this.chatomniConversationFacade.onSyncConversationInfo$.emit(info);
            this.chatomniCommentFacade.onSyncPartnerTimeStamp$.emit(info);
          },
          error: (error: any) => {
            this.message.error(error?.error?.message);
          }
      })
    }, 350);
  }

  destroyTimer() {
    if(this.onSyncTimer) {
      clearTimeout(this.onSyncTimer);
    }
    if (this.suggestTimer) {
      clearTimeout(this.suggestTimer);
    }
  }

  ngOnDestroy(): void {
    this.destroyTimer();
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

    this.loadDistricts(data._cities?.code);
    this.loadWards(data._districts?.code);
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
        isSelectAddress: true,
        isSelectAddressConversation: true,
        innerText: this.suggestText
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: any) => {
        if(result){
            this.partner = {...this.csPartner_SuggestionHandler.onLoadSuggestion(result.value, this.partner)};
            this.suggestText = result.value?.Address;
            this.suggestCopy = result.value?.Address;

            this.mappingAddress(this.partner);
            this.suggestText = this.partner.Street;

            if(result.type == 'confirm') {
                this.updatePartner(result.type);
            }
        }
        this.cdRef.detectChanges();
      }
  })}

  checkAddressByPhone() {
    let phone = this.partner.Phone;
    if (TDSHelperString.hasValueString(phone)) {
      this.commonService.checkAddressByPhone(phone).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.message.info('Chưa có dữ liệu');
        },
        error: (error: any) => {
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

      //TODO: trường hợp chọn xác nhận ở chỉnh sửa địa chỉ khách hàng
      case 'confirm':
        this.message.success('Lưu địa chỉ khách hàng thành công');
      break
    }
  }

  onOpenTrackingUrl(data: Conversation_LastBillDto) {
    if(data && TDSHelperString.hasValueString(data.TrackingUrl)) {
      window.open(data.TrackingUrl, '_blank')
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

    this.suggestText = null;
    this.suggestCopy = null;
    this.isSuggestion = false;
  }

  closeSearchAddress() {
    this.suggestText = null;
    this.suggestCopy = null;
  }

  onInputKeyupSuggestion(event: any) {
    let keyCode = event?.keyupEvent?.keyCode;
    if(keyCode && !((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || keyCode == 17)) return;

    this.suggestText = event?.value || null;
    this.suggestCopy = this.suggestText;

    if(!TDSHelperString.hasValueString(this.suggestText)) return;

    this.isLoadingAddress = true;
    this.suggestData = this.suggestService.suggest(this.suggestText)
      .pipe(takeUntil(this.destroy$)).pipe(map(x => ([...x?.data || []])), finalize(() => this.isLoadingAddress = false));
  }

  onSelectSuggestion(event: any) {
    this.suggestText = null;
    this.destroyTimer();

    this.suggestTimer = setTimeout(() => {
        this.suggestText = this.suggestCopy;

        this.cdRef.detectChanges();
    }, 50);
    let data = event.value;

    if(data) {
      this.isSuggestion = true;
      this.partner.Street = data.Address;
      this._street = data.Address;

      this.partner.CityCode = data.CityCode;
      this.partner.CityName = data.CityName;
      this.partner.City = {
        code: data.CityCode,
        name: data.CityName
      }

      this._cities = {
        code: data.CityCode,
        name: data.CityName
      }

      if(this.lstCity && this.lstCity.length == 0) {
        this.loadCity();
      }

      this.partner.DistrictCode = data.DistrictCode;
      this.partner.DistrictName = data.DistrictName;
      this.partner.District = {
        code: data.DistrictCode,
        name: data.DistrictName,
        cityName: data.CityCode,
        cityCode: data.CityName
      }

      this._districts = {
        code: data.DistrictCode,
        name: data.DistrictName,
        cityCode: data.CityCode,
        cityName: data.CityName
      }

      if(data.CityCode) {
        this.loadDistricts(data.CityCode);
      }

      this.partner.WardCode = data.WardCode;
      this.partner.WardName = data.WardName;
      this.partner.Ward = {
        code: data.WardCode,
        name: data.WardName,
        cityCode: data.CityCode,
        cityName: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictName
      }

      this._wards = {
        code: data.WardCode,
        name: data.WardName,
        cityName: data.CityCode,
        cityCode: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictName
      }

      if(data.DistrictCode) {
        this.loadWards(data.DistrictCode);
      }

      this.cdRef.detectChanges();
    }
  }

  loadCity(): void {
    this.lstCity = [];
    this.suggestService.setCity();
    this.suggestService.getCity().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.lstCity = [...res];
          this.citySubject.next(res);
        }
      });
  }

  loadDistricts(code: string) {
    this.lstDistrict = [];
    if(code && TDSHelperString.hasValueString(code)) return;

    this.suggestService.getDistrict(code).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.lstDistrict = [...res];
          this.districtSubject.next(res);
        }
      });
  }

  loadWards(code: string) {
    this.lstWard = [];
    if(code && TDSHelperString.hasValueString(code)) return;
    
    this.suggestService.getWard(code).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.lstWard = [...res];
          this.wardSubject.next(res);
        }
      });
  }

  handleCityFilter(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstCity?.filter((x: SuggestCitiesDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.citySubject.next(result);
    }
  }

  handleFilterDistrict(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstDistrict?.filter((x: SuggestDistrictsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.districtSubject.next(result);
    }
  }

  handleFilterWard(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstWard?.filter((x: SuggestWardsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.wardSubject.next(result);
    }
  }

  changeCity(city: SuggestCitiesDTO) {
    this.partner.CityCode = null;
    this.partner.CityName = null;
    this.partner.City = null as any;
    this._cities = null as any;

    this.partner.DistrictCode = null;
    this.partner.DistrictName = null;
    this.partner.District = null;
    this._districts = null as any;

    this.partner.WardCode = null;
    this.partner.WardName = null;
    this.partner.Ward = null as any;
    this._wards = null as any;

    if(city && city.code) {
      this.partner.CityCode = city.code;
      this.partner.CityName = city.name;
      this.partner.City = {
        code: city.code,
        name: city.name
      }

      this._cities = {
        code: city.code,
        name: city.name
      }

      this.loadDistricts(city.code);
    }

    this.mappingStreet();
    this.cdRef.detectChanges();
  }

  changeDistrict(district: SuggestDistrictsDTO) {
    this.partner.DistrictCode = null;
    this.partner.DistrictName = null;
    this.partner.District = null;
    this._districts = null as any;

    this.partner.WardCode = null;
    this.partner.WardName = null;
    this.partner.Ward = null as any;
    this._wards = null as any;

    if(district && district.code) {
      this.partner.DistrictCode = district.code;
      this.partner.DistrictName = district.name;
      this.partner.District = {
        code: district.code,
        name: district.name,
        cityCode: district.cityCode,
        cityName: district.cityName
      }

      this._districts = {
        code: district.code,
        name: district.name,
        cityCode: district.cityCode,
        cityName: district.cityName
      }

      this.loadWards(district.code);
    }

    this.mappingStreet();
    this.cdRef.detectChanges();
  }

  changeWard(ward: SuggestWardsDTO) {
    this.partner.WardCode = null;
    this.partner.WardName = null;
    this.partner.Ward = null as any;
    this._wards = null as any;

    if(ward && ward.code) {
      this.partner.WardCode = ward.code;
      this.partner.WardName = ward.name;
      this.partner.Ward = {
        code: ward.code,
        name: ward.name,
        cityCode: ward.cityCode,
        cityName: ward.cityName,
        districtCode: ward.districtCode,
        districtName: ward.districtName
      }

      this._wards = {
        code: ward.code,
        name: ward.name,
        cityName: ward.cityCode,
        cityCode: ward.cityName,
        districtCode: ward.districtCode,
        districtName: ward.districtName
      }
    }

    this.mappingStreet();
    this.cdRef.detectChanges();
  }

  mappingStreet(){
    let street = (TDSHelperString.hasValueString(this.partner.WardName) ? (this.partner.WardName + ', ') : '')
      + (TDSHelperString.hasValueString(this.partner.DistrictName) ? (this.partner.DistrictName + ', ') : '')
      + (TDSHelperString.hasValueString(this.partner.CityName) ? this.partner.CityName : '');

    this.partner.Street = street;
    this._street = street as any;
  }

}
