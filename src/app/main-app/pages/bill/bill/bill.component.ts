import { CRMTeamDTO } from './../../../dto/team/team.dto';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { Message } from './../../../../lib/consts/message.const';
import { GenerateMessageTypeEnum } from './../../../dto/conversation/message.dto';
import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { CRMMatchingService } from './../../../services/crm-matching.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { PartnerService } from './../../../services/partner.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib/enum/sort.enum';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FilterObjFastSaleModel, OdataFastSaleOrderService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder.service';
import { addDays } from 'date-fns/esm';
import { TagService } from 'src/app/main-app/services/tag.service';
import { THelperCacheService } from 'src/app/lib';
import { ColumnTableDTO } from '../components/config-column/config-column.component';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { FastSaleOrderDTO, FastSaleOrderSummaryStatusModelDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { DeliveryCarrierV2Service } from '@app/services/delivery-carrier-v2.service';
import { FilterOptionsComponent } from '../components/filter-option/filter-options.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html'
})

export class BillComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild('widthTable') widthTable!: ElementRef;
  @ViewChild('billOrderLines') billOrderLines!: ElementRef;

  @ViewChild(FilterOptionsComponent) filterOptions!: TDSSafeAny;

  lstOfData: Array<FastSaleOrderDTO> = [];
  lstOfTeam!: CRMTeamDTO[];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  widthCollapse: number = 0;
  paddingCollapse: number = 36;
  marginLeftCollapse: number = 0;
  mappingTeams: any[] = [];
  currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;
  lstCarriers!: Array<DeliveryCarrierDTOV2>;
  carrierId!: string | null;

  carrierDeliveryType!: string | null;

  public filterObj: FilterObjFastSaleModel = {
    tags: [],
    status: [],
    hasTracking: null,
    carrierId: -1,
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    },
    shipPaymentStatus: null,
    liveCampaignId: null,
  }

  filterStatus = [
    { Name: 'Nháp', Type: 'draft', Total: 0 },
    { Name: 'Đã xác nhận', Type: 'open', Total: 0 },
    { Name: 'Đã thanh toán', Type: 'paid', Total: 0 },
    { Name: 'Hủy bỏ', Type: 'cancel', Total: 0 }
  ];

  public lstShipStatus: any[] = [
    { value: 'none', text: 'Chưa tiếp nhận' },
    { value: 'refund', text: 'Hàng trả về' },
    { value: 'other', text: 'Đối soát không thành công' },
    { value: 'sent', text: 'Đã tiếp nhận' },
    { value: 'cancel', text: 'Đã hủy' },
    { value: 'done', text: 'Đã thu tiền' },
    { value: 'done_and_refund', text: 'Đã thu tiền và trả hàng về' }
  ]

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'PartnerDisplayName', name: 'Khách hàng', isChecked: true },
    { value: 'LiveCampaignName', name: 'Chiến dịch live', isChecked: false },
    { value: 'DateInvoice', name: 'Ngày bán', isChecked: false },
    { value: 'Number', name: 'Số HĐ', isChecked: true },
    { value: 'CashOnDelivery', name: 'Tiền thu hộ', isChecked: false },
    { value: 'CarrierName', name: 'Đối tác giao hàng', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: false },
    { value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true },
    { value: 'CustomerDeliveryPrice', name: 'Phí ship đối tác', isChecked: false },
    { value: 'DeliveryPrice', name: 'Phí giao hàng', isChecked: false },
    { value: 'ShipPaymentStatus', name: 'Trạng thái GH', isChecked: false },
    { value: 'PrintShipCount', name: 'Số lần in Ship', isChecked: false },
    { value: 'PrintDeliveryCount', name: 'Số lần in HĐ', isChecked: false },
    { value: 'ShowShipStatus', name: 'Đối soát GH', isChecked: true },
    { value: 'CreateByName', name: 'Người lập', isChecked: false },
    { value: 'DateCreated', name: 'Ngày tạo đơn', isChecked: true },
    { value: 'AmountTotal', name: 'Tổng tiền', isChecked: true },
    { value: 'Residual', name: 'Còn nợ', isChecked: true },
    { value: 'CRMTeamName', name: 'Thông tin', isChecked: true },
    { value: 'ShowState', name: 'Trạng thái', isChecked: true },
    { value: 'IsRefund', name: 'Đơn hàng trả', isChecked: false },
  ];

  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO> = [{
    field: "DateInvoice",
    dir: SortEnum.desc,
  }];

  isOpenMessageFacebook = false;
  indClickTag = -1
  tabIndex: number = 1;

  indClickStatus = -1;
  currentStatus: TDSSafeAny;
  public summaryStatus: Array<TabNavsDTO> = [];
  public tabNavs: Array<TabNavsDTO> = [];
  public lstTags: Array<TDSSafeAny> = [];
  expandSet = new Set<number>();
  isTabNavs: boolean = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  private destroy$ = new Subject<void>();

  lstOfFilterDate = [
    { text: 'Mới nhất', value: 'asc' },
    { text: 'Cũ nhất', value: 'desc' }
  ]
  filterDate: string = '';
  isFilterObjStatus: boolean = false;

  constructor(private odataFastSaleOrderService: OdataFastSaleOrderService,
    @Inject(DOCUMENT) private document: Document,
    private tagService: TagService,
    private router: Router,
    private modal: TDSModalService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private viewContainerRef: ViewContainerRef,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private resizeObserver: TDSResizeObserver,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private deliveryCarrierService: DeliveryCarrierV2Service,
    private crmMatchingService: CRMMatchingService,
    private chatomniConversationService: ChatomniConversationService,
    private chatomniMessageFacade: ChatomniMessageFacade) {
  }

  ngOnInit(): void {
    this.loadAllTeam();
    this.loadSummaryStatus();
    this.loadTags();
    this.loadGridConfig();

    this.fastSaleOrderService.onLoadPage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs) => {
        if (TDSHelperString.hasValueString(obs && obs == "onLoadPage")) {
          this.loadData(this.pageSize, this.pageIndex);
        }
      }
    })
    this.loadDeliveryCarrier();
  }

  loadAllTeam() {
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res && TDSHelperArray.hasListValue(res)) {
          this.lstOfTeam = [...res];
        }
      },
      error: (err) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  loadDeliveryCarrier(){
    this.deliveryCarrierService.setDeliveryCarrier();
    this.deliveryCarrierService.getDeliveryCarrier().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        this.lstCarriers = [...res.value];
      },
      error: error =>{
        this.message.error(error?.error?.message || Message.CanNotLoadData);
      }
    })
  }

  loadSummaryStatus() {
    let startDate = this.filterObj?.dateRange.startDate as any;
    if(startDate) {
        startDate = this.datePipe.transform(new Date(startDate), 'yyyy-MM-ddT00:00:00+00:00');
    }

    let endDate = this.filterObj?.dateRange.endDate as any;
    if(endDate) {
        endDate = this.datePipe.transform(new Date(endDate), 'yyyy-MM-ddTHH:mm:ss+00:00');
    }

    let model = {
      DateStart: startDate,
      DateEnd: endDate,
      SearchText: TDSHelperString.stripSpecialChars(this.filterObj.searchText.trim()),
      TagIds: this.filterObj.tags.join(","),
      TrackingRef: this.filterObj.hasTracking,
      States: this.filterObj.status?.length > 0 ? [...this.filterObj.status] : [],
      ShipPaymentStatus: this.filterObj.shipPaymentStatus,
      CarrierId: this.filterObj.carrierId > 0 ? this.filterObj.carrierId: null,
      LiveCampaignId: this.filterObj.liveCampaignId
    } as FastSaleOrderSummaryStatusModelDTO;


    this.isTabNavs = true;
    this.fastSaleOrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$),
      finalize(() => this.isTabNavs = false)).subscribe({
        next: (res: Array<TDSSafeAny>) => {
          let tabs: TabNavsDTO[] = [];
          let total = 0;
          res.map((x: TDSSafeAny, index: number) => {

            total += x.Total;
            index = index + 2;

            tabs.push({ Name: x.Type, Index: index, Total: x.Total });
          });

          tabs.push({ Name: "Tất cả", Index: 1, Total: total });
          tabs.sort((a, b) => a.Index - b.Index);

          this.tabNavs = [...tabs];
          this.summaryStatus = this.tabNavs;
        }
      });
  }

  loadGridConfig() {
    const key = this.fastSaleOrderService._keyCacheGrid;
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

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.fastSaleOrderService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  removeCheckedRow() {
    this.setOfCheckedId.clear();

    this.indeterminate = false;
    this.checked = false;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach((x: any) => this.updateCheckedSet(x.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
      next: (res: ODataFastSaleOrderDTO) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
      },
      error: (error: any) => {
        this.message.error(`${error?.error?.message}` || 'Tải dữ liệu phiếu bán hàng thất bại!');
      }
    });
  }

  private getViewData(params: string): Observable<ODataFastSaleOrderDTO> {
    this.isLoading = true;
    return this.odataFastSaleOrderService
      .getView(params, this.filterObj).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  loadTags() {
    let type = "fastsaleorder";
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        this.lstTags = res.value;
      }
    })
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<number>();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = -1;
  }

  assignTags(id: number, tags: TDSSafeAny) {
    if(tags == null) {
      this.message.error("Vui lòng nhập tên thẻ!");
      return;
    }
    let model = { OrderId: id, Tags: tags };
    this.fastSaleOrderService.assignTagFastSaleOrder(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {

        if (res && res.OrderId) {
          let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if (exits) {
            exits.Tags = JSON.stringify(tags);
          }

          this.indClickTag = -1;
          this.modelTags = [];
          this.message.success(Message.Tag.UpdateSuccess);
        }
      },
      error: (error: any) => {
        this.indClickTag = -1;
        this.message.error(Message.Tag.UpdateFail);
      }
    });
  }

  openShipStatus(data: FastSaleOrderDTO, dataId: number) {
    this.indClickStatus = dataId;
    this.currentStatus = {
      value: data.ShipStatus,
      text: data.ShowShipStatus
    }
  }

  changeShipStatus(status: TDSSafeAny) {
    this.currentStatus = status;
  }

  closeShipStatus(): void {
    this.indClickStatus = -1;
  }

  assignShipStatus(dataId: number) {
    if (this.currentStatus) {
      let model = { id: dataId, status: this.currentStatus.value };

      this.fastSaleOrderService.updateShipStatus(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if (res && res.success) {
            this.lstOfData.map((fso: FastSaleOrderDTO) => {
              if (fso.Id == dataId) {
                fso.ShipStatus = this.currentStatus.value;
                fso.ShowShipStatus = this.currentStatus.text;
              }
            });

            this.message.success(Message.UpdatedSuccess);
          } else {
            this.message.error(Message.UpdatedFail);
          }

          this.indClickStatus = -1;
        },
        error: (error: any) => {
          this.message.error(error?.error?.message || Message.UpdatedFail);
          this.indClickStatus = -1;
        }
      })
    } else {
      this.message.error('Vui lòng chọn đối soát giao hàng');
    }
  }

  onSelectChange(index: TDSSafeAny) {
    let item = this.tabNavs.filter(f => f.Index == index)[0];

    if (item?.Name == 'Tất cả') {
        this.filterObj.status = [];

        if(this.isFilterObjStatus) {
          this.tabNavs.map((x: TabNavsDTO) => {
            if(x?.Name != 'Tất cả') {
              this.filterObj.status.push(x.Name);
            }
          })
        }
    } else {
        this.filterObj.status = [];
        this.filterObj.status.push(item.Name);
    }

    this.pageIndex = 1;
    this.indClickTag = -1;
    // this.filterObj.tags = [];

    this.indeterminate = false;
    this.loadData(this.pageSize, this.pageIndex);
  }

  ngAfterViewInit(): void {
    this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse
    this.resizeObserver.observe(this.widthTable).subscribe({
      next: () => {
        this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.widthTable?.nativeElement?.click();
      }
    });

    setTimeout(() => {
      let that = this;

      if (that.billOrderLines) {
        let wrapScroll = that.billOrderLines?.nativeElement?.closest('.tds-table-body');

        wrapScroll.addEventListener('scroll', function () {
          let scrollleft = wrapScroll.scrollLeft;
          that.marginLeftCollapse = scrollleft;
        });
      }
    }, 500);

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      // distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: TDSSafeAny) => {

        this.tabIndex = 1;
        this.pageIndex = 1;
        this.indClickTag = -1;

        this.filterObj.searchText = text;
        let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

        return this.getViewData(params);
      })
    ).subscribe({
      next: (res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
        this.setOfCheckedId.clear();
        this.loadSummaryStatus();
      },
      error: (error: any) => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
      }
    });
  }

  onLoadOption(event: FilterObjFastSaleModel): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.tags = event.tags;
    this.filterObj.status = event.status;
    this.filterObj.hasTracking = event.hasTracking;
    this.filterObj.tags = event.tags;

    this.filterObj.dateRange = {
      startDate: event.dateRange.startDate,
      endDate: event.dateRange.endDate
    }

    this.filterObj.shipPaymentStatus = event.shipPaymentStatus;
    this.filterObj.liveCampaignId = event.liveCampaignId;


    if (TDSHelperArray.hasListValue(event.status)) {
      this.tabNavs = this.summaryStatus.filter(f => event.status.includes(f.Name));
      this.isFilterObjStatus = true;
    } else {
      this.tabNavs = this.summaryStatus;
      this.isFilterObjStatus = false;
    }
    this.removeCheckedRow();
    this.loadData(this.pageSize, this.pageIndex);
    this.loadSummaryStatus();
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string) {
    this.isOpenMessageFacebook = true;
  }

  closeDrawerMessage(ev: boolean) {
    this.isOpenMessageFacebook = false;
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
    this.removeCheckedRow();
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.innerText.nativeElement.value = '';
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.carrierDeliveryType = null;
    this.carrierId = null;

    this.filterObj = {
      tags: [],
      status: [],
      hasTracking: null,
      carrierId: -1,
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      },
      shipPaymentStatus: null,
      liveCampaignId: null
    }

    this.filterOptions.onCancel();
  }

  onView(data: any) {
    this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  onDelete(data: any) {
    this.modal.error({
      title: 'Xóa hóa đơn',
      content: 'Bạn có muốn xóa hóa đơn',
      onOk: () => {
        this.fastSaleOrderService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.message.success('Xóa hóa đơn thành công!');
            this.loadData(this.pageSize, this.pageIndex);
          },
          error: (error: any) => {
            this.message.error(`${error?.error?.message}`);
          }
        })
      },
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;
    this.isLoading = true;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    if(!TDSHelperString.hasValueString(data.CRMTeamId)) {
      this.isLoading = false;
      this.message.error(Message.PageNotExist);
      return;
    }

    this.partnerService.getAllByPartnerId(data.CRMTeamId, partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any): any => {

        let pageIds: any = [];
        obs?.map((x: any) => {
          pageIds.push(x.ChannelId);
        });

        if (pageIds.length == 0) {
          this.isLoading = false;
          return this.message.error('Không có kênh kết nối với khách hàng này.');
        }

        this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
          next: (teams: any): any => {

            if (teams?.length == 0) {
              this.isLoading = false;
              return this.message.error('Không có kênh kết nối với khách hàng này.');
            }

            this.mappingTeams = [];
            let pageDic = {} as any;

            teams.map((x: any) => {
              let exist = obs?.filter((r: any) => r.ChannelId == x.ChannelId)[0];

              if (exist && !pageDic[exist.ChannelId]) {
                pageDic[exist.paChannelIdge_id] = true; // Cờ này để không thêm trùng page vào

                this.mappingTeams.push({
                  psid: exist.UserId,
                  team: x
                })
              }
            })

            if (this.mappingTeams.length > 0) {
              this.currentMappingTeam = this.mappingTeams[0];
              this.loadMDBByPSId(this.currentMappingTeam.team?.Id, this.currentMappingTeam.psid);
            }
          }
        })
      },
      error: (error: any) => {
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
          // let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
          this.currentConversation = { ...res };

          this.psid = psid;
          this.isOpenDrawer = true;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
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

  showMessageModal(orderMessage: TDSSafeAny) {
    this.modal.create({
      title: 'Gửi tin nhắn Facebook',
      size: 'lg',
      content: SendMessageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        selectedUsers: [orderMessage.Id],
        messageType: GenerateMessageTypeEnum.Bill
      }
    })
  }

  onChangeDeliveryId(event: DeliveryCarrierDTOV2) {
    if (event && event.Id) {
        this.filterObj.carrierId = event.Id;
    } else {
        this.filterObj.carrierId = -1;
    }
    this.loadData(this.pageSize, this.pageIndex);
    this.loadSummaryStatus();
  }

  onOpenTrackingUrl(data: FastSaleOrderDTO) {
    if(data && TDSHelperString.hasValueString(data.TrackingUrl)) {
      window.open(data.TrackingUrl, '_blank')
    }
  }

  onChangeFilterDate() {
    let data = this.lstOfData;
    switch(this.filterDate) {
      case '':
        this.filterDate = 'asc';
        data = data.sort((a: FastSaleOrderDTO, b: FastSaleOrderDTO) => new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime());
      break;

      case 'asc':
        this.filterDate = 'desc';
        data = data.sort((a: FastSaleOrderDTO, b: FastSaleOrderDTO) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());

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
    this.innerText.nativeElement.value = '';
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.filterObj.searchText = '';
    
    this.loadData(this.pageSize, this.pageIndex);
    this.loadSummaryStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
