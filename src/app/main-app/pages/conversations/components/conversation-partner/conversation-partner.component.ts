import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, EventEmitter } from '@angular/core';
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
    // this.conversationOrderFacade.loadPartnerByPostComment$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataItemDto) => {
    //   if(TDSHelperObject.hasValue(res)) {
    //       (this.omcs_Item as any) = null;

    //       let pageId = this.team.ChannelId;
    //       let psid = res.UserId || res.Data.from.id;
    //       this.loadData(pageId, psid);
    //   }
    // })

    // // TODO: load thông tin partner khi tạo đơn hàng thành công
    // this.omniEventEmiter.callConversationPartnerEmiter$.pipe(takeUntil(this.destroy$)).subscribe(res => {
    //   if(res) {
    //     let psid = this.omcs_Item.ConversationId;
    //     let pageId = this.team.ChannelId;
    //     this.loadData(pageId, psid);
    //   }
    // })
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
    if(this.team && TDSHelperObject.hasValue(conversationInfo.Partner)) {
        this.partner = {...conversationInfo.Partner};
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
        this.lstBill = [...conversationInfo.Bill.Data];
        this.lstBill.map(x => {
          this.totalBill = this.totalBill + x.Total;
        })
    }

    if(conversationInfo && conversationInfo.Revenue) {
        this.revenue = {...conversationInfo.Revenue};
    }
  }

  checkConversation(pageId: string, psid: string): any {
    // if(!TDSHelperString.hasValueString(pageId)) {
    //     return this.message.error('Không tìm thấy Facebook_PageId');
    // }
    // if(!TDSHelperString.hasValueString(psid)) {
    //     return this.message.error('Không tìm thấy psid');
    // }

    // this.isLoading = true;
    // this.partnerService.checkConversation(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe((res: TabPartnerCvsRequestDTO) => {

    //   if(res?.Data && res?.Success) {
    //       let x = { ... res.Data} as TabPartnerCvsRequestModel;

    //       x.Facebook_ASUserId = x.Facebook_ASUserId || this.omcs_Item?.Id;
    //       x.Name = x.Name || x.Facebook_UserName ||  this.omcs_Item?.Name;
    //       x.Phone = x.Phone || this.omcs_Item?.Phone;
    //       x.Street = x.Street;

    //       // TODO: 2 field gán thêm để mapping qua conversation-order, xem cmt dto
    //       x.page_id = pageId;
    //       x.psid = psid;

    //       // TODO: gán lại thông tin chi tiết đơn hàng
    //       this.partner = x;
    //       this.mappingAddress(this.partner);

    //       // TODO: load dữ liệu đơn hàng, phiếu bán hàng theo partnerId
    //       let partnerId = x.Id || this.omcs_Item?.PartnerId;
    //       if(partnerId) {
    //           this.loadPartnerBill(partnerId);
    //           this.loadPartnerRevenue(partnerId);
    //       }

    //       // Load đơn hàng khác từ bên bài viết gọi qua
    //       if(this.type != 'post') {
    //         this.partnerService.onLoadOrderFromTabPartner$.emit(this.partner);
    //       }

    //       this.isLoading = false;
    //   }
    //   }, error => {
    //       this.isLoading = false;
    //       this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    //   })
  }

  loadPartnerFromTabOrder() {
    this.partnerService.onLoadPartnerFromTabOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: QuickSaleOnlineOrderModel) => {
        if(res) {
           let partner = this.csPartner_PrepareModelHandler.loadPartnerFromTabOrder(this.partner, res);
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
        psid: this.partner?.FacebookASIds || this.partner.FacebookPSId,
        accessToken: currentTeam?.ChannelToken,
        facebookName: this.partner?.Name,
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
    this.saleOnline_OrderService.createUpdatePartner({ model: model, teamId: teamId }).pipe(takeUntil(this.destroy$)).subscribe(res => {

        delete res['@odata.context'];
        this.message.success('Cập nhật khách hàng thành công');

        let x = { ... res} as CreateOrUpdatePartnerModel;

        // TODO: kiểm tra số điện thoại
        let phone = x.Phone as string;

        // Xử lý meger map để để gán lên trên
        if(TDSHelperString.hasValueString(phone)) {
          this.crmMatchingService.checkPhoneReport(phone).pipe(takeUntil(this.destroy$)).subscribe((obs) => {
              this.partner.PhoneReport = obs.is_report;
          }, error => {
              this.message.error(`${error?.error?.message}`);
          })
        }

        let partnerUpdate = this.csPartner_PrepareModelHandler.updatePartnerModel(this.partner, x);

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
    let model = this.csPartner_PrepareModelHandler.prepareModel(this.partner, this.conversationItem);
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
    let data = this.csPartner_SuggestionHandler.mappingAddress(partner);

    this._cities = data._cities;
    this._districts = data._districts;
    this._wards = data._wards;
    this._street = data._street;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateData() {
    this.conversationInfo = null;
    (this.partner as any) = null;
    (this.revenue as any) = null;
    (this.lastBill as any) = null;
    (this.lstBill as any) = null;
  }

}
