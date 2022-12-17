import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
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

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
    providers: [TDSDestroyService],
    host: {
      class: 'w-full h-full flex'
    },
})

export class ConversationPartnerComponent implements OnInit, OnChanges {

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

  onSyncConversationOrder(csid: any) {
    setTimeout(() => {
      this.chatomniConversationService.getInfo(this.team.Id, csid).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (info: ChatomniConversationInfoDto) => {
              this.chatomniConversationFacade.onSyncConversationOrder$.emit(info);
              this.chatomniConversationFacade.onSyncConversationInfo$.emit(info);
          },
          error: (error: any) => {
              this.message.error(error?.error?.message);
          }
      })
    }, 350);
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
        isSelectAddress: true,
        isSelectAddressConversation: true
      }
    });

  modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
    next: (result: TDSSafeAny) => {
      if(result){
          this.partner = {...this.csPartner_SuggestionHandler.onLoadSuggestion(result.value, this.partner)};
          this.mappingAddress(this.partner);
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
  }

}
