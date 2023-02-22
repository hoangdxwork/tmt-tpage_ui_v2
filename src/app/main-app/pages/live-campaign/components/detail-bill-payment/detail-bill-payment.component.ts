import { BillFilterOptionsComponent } from './../../../../shared/bill-filter-options/bill-filter-options.component';
import { ChatomniConversationService } from './../../../../services/chatomni-service/chatomni-conversation.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { PartnerService } from './../../../../services/partner.service';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { finalize } from 'rxjs/operators';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderDTO, FastSaleOrderModelDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { TagsPartnerDTO } from 'src/app/main-app/dto/partner/partner-tags.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ODataLiveCampaignBillService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-bill.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { ModalConfirmedDepositComponent } from '../modal-confirmed-deposit/modal-confirmed-deposit.component';
import { ModalPaymentComponent } from '../modal-payment/modal-payment.component';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { ColumnTableDTO } from '@app/dto/common/table.dto';

@Component({
  selector: 'detail-bill-payment',
  templateUrl: './detail-bill-payment.component.html',
  styles: [
    `.image-payment:hover .show-img-payment {
      display: flex
    }`
  ],
  providers: [ TDSDestroyService ]
})
export class DetailBillPaymentComponent implements OnInit {

  @Input() liveCampaignId!: string;

  @ViewChild(BillFilterOptionsComponent) billFilterOptions!: TDSSafeAny;

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    bill: null,
    deliveryType: '',
    carrierDeliveryType: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    },
    carrierId: -1
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<FastSaleOrderModelDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  indClickTag = -1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  isVisible = false;
  isVisiblePayment = false;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  public lstTags: TagsPartnerDTO[] = [];
  public modelTags: Array<TDSSafeAny> = [];
  filterDate: string = '';

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'IRAttachmentUrl', name: 'Hình thanh toán', isChecked: true },
    { value: 'Number', name: 'Số HĐ', isChecked: true },
    { value: 'PartnerDisplayName', name: 'Khách hàng', isChecked: true },
    { value: 'AmountDeposit', name: 'Tiền cọc', isChecked: true },
    { value: 'Residual', name: 'Còn nợ', isChecked: true },
    { value: 'AmountTotal', name: 'Tổng tiền', isChecked: true },
    { value: 'CashOnDelivery', name: 'Tiền thu hộ', isChecked: true },
    { value: 'ShowState', name: 'Trạng thái', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
    { value: 'DateCreated', name: 'Ngày cập nhật', isChecked: true },
  ];

  constructor(
    private tagService: TagService,
    private message: TDSMessageService,
    private router: Router,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private fastSaleOrderService: FastSaleOrderService,
    private oDataLiveCampaignBillService: ODataLiveCampaignBillService,
    private partnerService: PartnerService,
    private cacheApi: THelperCacheService,
    private destroy$: TDSDestroyService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private chatomniConversationService: ChatomniConversationService
  ) { }

  ngOnInit(): void {
    this.setFilter();
    this.loadTags();
    this.loadGridConfig();
  }

  setFilter() {
    this.filterObj.liveCampaignId = this.liveCampaignId;
    this.filterObj.isWaitPayment = true;
  }

  loadTags(){
    let type = "fastsaleorder";
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    });
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignBillService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: res => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = res.value;
      }, 
        error: error => {
          this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
      }
    });
  }

  private getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignBillService
        .getView(params, this.filterObj)
        .pipe(finalize(() => {this.isLoading = false }));
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: event.tags,
      status: event.status,
      bill: event.bill,
      isWaitPayment: true,
      liveCampaignId: this.liveCampaignId,
      deliveryType: event.deliveryType,
      carrierDeliveryType: event.carrierDeliveryType,
      searchText: this.filterObj.searchText,
      dateRange: event.dateRange ? {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate
      } : null,
      carrierId: event.carrierId
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: [],
      status: '',
      bill: null,
      isWaitPayment: true,
      liveCampaignId: this.liveCampaignId,
      carrierDeliveryType: '',
      deliveryType: '',
      searchText: '',
      carrierId: -1,
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.billFilterOptions.onCancel();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.removeCheckedRow();
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.filterObj.searchText = data.value;

    this.loadData(this.pageSize, this.pageIndex);
  }

  onEdit(id: number) {
    this.router.navigateByUrl(`bill/detail/${id}`);
  }

  onPayment(id: number) {
    this.message.info("Thanh toán");
  }

  closeTag(): void {
    this.indClickTag = -1;
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  assignTags(id: number, tags: TDSSafeAny) {
    if(tags == null) {
      this.message.error("Vui lòng nhập tên thẻ!");
      return;
    }
    let model = { OrderId: id, Tags: tags };
    this.fastSaleOrderService.assignTagFastSaleOrder(model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          if(res && res.OrderId) {
            var exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
            if(exits) {
              exits.Tags = JSON.stringify(tags)
            }
  
            this.indClickTag = -1;
            this.modelTags = [];
            this.message.success('Gán nhãn thành công!');
          }
  
      }, 
        error: error => {
          this.indClickTag = -1;
          this.message.error('Gán nhãn thất bại!');
      }
    });
  }

  showModalDeposit(data: FastSaleOrderModelDTO) {
    let modal = this.modal.create({
      title: 'Xác nhận tiền cọc',
      content: ModalConfirmedDepositComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res) {
        this.refreshData();
      }
    });
  }

  showModalPayment(id: number, state: string) {
    if(state != "open") {
      this.message.info(Message.Bill.ErrorConfirmedSate);
      return;
    }

    this.modal.create({
      title: 'Đăng ký thanh toán',
      content: ModalPaymentComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        id: [id]
      }
    });
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;
    this.isLoading = true;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    if(!TDSHelperString.hasValueString(data.TeamId || data.CRMTeamId)) {
      this.isLoading = false;
      this.message.error(Message.PageNotExist);
      return;
    }

    this.partnerService.getAllByPartnerId((data.TeamId || data.CRMTeamId), partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any): any => {

        let pageIds: any = [];
        res.map((x: any) => {
          pageIds.push(x.ChannelId);
        });

        if (pageIds.length == 0) {
          this.isLoading = false;
          return this.message.error('Không có kênh kết nối với khách hàng này.');
        }

        this.crmTeamService.getActiveByPageIds$(pageIds)
          .pipe(takeUntil(this.destroy$)).subscribe((teams: any): any => {

            if (teams.length == 0) {
              this.isLoading = false;
              return this.message.error('Không có kênh kết nối với khách hàng này.');
            }

            this.mappingTeams = [];
            let pageDic = {} as any;

            teams.map((x: any) => {
              let exist = res.filter((r: any) => r.ChannelId == x.ChannelId)[0];

              if (exist && !pageDic[exist.ChannelId]) {

                pageDic[exist.ChannelId] = true; // Cờ này để không thêm trùng page vào

                this.mappingTeams.push({
                  psid: exist.UserId,
                  team: x
                })
              }
            })

            if (this.mappingTeams.length > 0) {
              this.currentMappingTeam = this.mappingTeams[0];
              this.loadMDBByPSId(this.currentMappingTeam.team.Id, this.currentMappingTeam.psid);
            } else {
              this.isLoading = false;
            }
          });
      },
      error: error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
      }
    })
  }

  loadMDBByPSId(channelId: number, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;
    if(!TDSHelperString.hasValueString(psid)) {
      this.message.error('Không tìm thấy ConversationId');
      return;
    }
    // get data currentConversation
    this.chatomniConversationService.getById(channelId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationItemDto) => {
        if (res) {
            // let model = this.chatomniMessageFacade.mappingCurrentConversation(res);
            this.currentConversation = { ...res };

            this.psid = psid;
            this.isOpenDrawer = true;
            this.isLoading = false;
        }
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.ChannelId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.oDataLiveCampaignBillService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  loadGridConfig() {
    const key = this.oDataLiveCampaignBillService._keyCacheGrid;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TDSSafeAny) => {
            if (res && res.value) {
              let jsColumns = JSON.parse(res.value) as any;
              this.hiddenColumns = jsColumns.value.columnConfig;
            } else {
              this.hiddenColumns = this.columns;
            }
        }
    })
  }

  onChangeFilterDate() {
    let data = this.lstOfData;
    switch(this.filterDate) {
      case '':
        this.filterDate = 'asc';
        data = data.sort((a: FastSaleOrderModelDTO, b: FastSaleOrderModelDTO) => new Date(a.DateCreated || '').getTime() - new Date(b.DateCreated|| '').getTime());
      break;

      case 'asc':
        this.filterDate = 'desc';
        data = data.sort((a: FastSaleOrderModelDTO, b: FastSaleOrderModelDTO) => new Date(b.DateCreated|| '').getTime() - new Date(a.DateCreated|| '').getTime());

      break;

      case'desc':
        this.filterDate = '';
      break;
    }

    this.lstOfData = [...data];
  }

  onClearFilterSearch() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.filterObj.searchText = '';

    this.loadData(this.pageSize, this.pageIndex);
  }

  removeCheckedRow() {
    this.setOfCheckedId.clear();

    this.indeterminate = false;
    this.checked = false;
  }
}
