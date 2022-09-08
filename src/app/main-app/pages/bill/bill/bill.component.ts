import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { Message } from './../../../../lib/consts/message.const';
import { GenerateMessageTypeEnum } from './../../../dto/conversation/message.dto';
import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { CRMMatchingService } from './../../../services/crm-matching.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { PartnerService } from './../../../services/partner.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib/enum/sort.enum';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FilterObjFastSaleModel, OdataFastSaleOrderService } from 'src/app/main-app/services/mock-odata/odata-fastsaleorder.service';
import { addDays } from 'date-fns/esm';
import { TagService } from 'src/app/main-app/services/tag.service';
import { THelperCacheService } from 'src/app/lib';
import { ColumnTableDTO } from '../components/config-column/config-column.component';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { FastSaleOrderDTO, ODataFastSaleOrderDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html'
})

export class BillComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild('widthTable') widthTable!: ElementRef;
  @ViewChild('billOrderLines') billOrderLines!: ElementRef;

  lstOfData: Array<FastSaleOrderDTO> = [];
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
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;

  public filterObj: FilterObjFastSaleModel = {
    tags: [],
    status: [],
    hasTracking: null,
    deliveryType: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
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
    { value: 'DateInvoice', name: 'Ngày bán', isChecked: false },
    { value: 'Number', name: 'Số HĐ', isChecked: true },
    { value: 'CashOnDelivery', name: 'Tiền thu hộ', isChecked: false },
    { value: 'CarrierName', name: 'Đối tác giao hàng', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: false },
    { value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true },
    { value: 'CustomerDeliveryPrice', name: 'Phí ship đối tác', isChecked: false },
    { value: 'DeliveryPrice', name: 'Phí giao hàng', isChecked: false },
    { value: 'ShipPaymentStatus', name: 'Trạng thái GH', isChecked: false },
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
  public lstOftabNavs: Array<TabNavsDTO> = [];
  public tabNavs: Array<TabNavsDTO> = [];
  public lstTags: Array<TDSSafeAny> = [];
  expandSet = new Set<number>();
  isTabNavs: boolean = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  private destroy$ = new Subject<void>();

  constructor(private odataFastSaleOrderService: OdataFastSaleOrderService,
    private tagService: TagService,
    private router: Router,
    private modal: TDSModalService,
    private cdRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private resizeObserver: TDSResizeObserver,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private deliveryCarrierService: DeliveryCarrierService,
    private crmMatchingService: CRMMatchingService,
    private chatomniMessageFacade: ChatomniMessageFacade) {
  }

  ngOnInit(): void {
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

    this.lstCarriers = this.loadCarrier();
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  loadSummaryStatus() {
    let model = {
      DateStart: this.filterObj.dateRange.startDate,
      DateEnd: this.filterObj.dateRange.endDate,
      SearchText: TDSHelperString.stripSpecialChars(this.filterObj.searchText.trim()),
      TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
      TrackingRef: this.filterObj.hasTracking,
      DeliveryType: this.filterObj.deliveryType ? this.filterObj.deliveryType : null,
    };


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
              this.lstOftabNavs = this.tabNavs;
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
    this.setOfCheckedId = new Set<number>();
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
    this.filterObj.status = [];
    let item = this.tabNavs.filter(f => f.Index == index)[0];

    if (item?.Name == 'Tất cả') {
      this.filterObj.status = [];
    } else {
      this.filterObj.status.push(item.Name);
    }

    this.pageIndex = 1;
    this.indClickTag = -1;
    this.filterObj.tags = [];

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
        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);

        return this.getViewData(params);
      })
    ).subscribe({
      next: (res: any) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...res.value];
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
    this.filterObj.deliveryType = event.deliveryType;
    this.filterObj.tags = event.tags;

    this.filterObj.dateRange = {
      startDate: event.dateRange.startDate,
      endDate: event.dateRange.endDate
    }

    if (TDSHelperArray.hasListValue(event.status)) {
      this.tabNavs = this.lstOftabNavs.filter(f => event.status.includes(f.Name));
    }else{
      this.tabNavs = this.lstOftabNavs;
    }
    this.removeCheckedRow();
    this.loadData(this.pageSize, this.pageIndex);
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
    this.checked = false;
    this.indeterminate = false;
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.innerText.nativeElement.value = '';
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
      tags: [],
      status: [],
      hasTracking: null,
      deliveryType: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
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

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any): any => {

          let pageIds: any = [];
          obs?.map((x: any) => {
              pageIds.push(x.page_id);
          });

          if (pageIds.length == 0) {
              return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
            next: (teams: any): any => {
                if (teams?.length == 0) {
                    return this.message.error('Không có kênh kết nối với khách hàng này.');
                }

                this.mappingTeams = [];
                let pageDic = {} as any;

                teams.map((x: any) => {
                    let exist = obs?.filter((r: any) => r.page_id == x.ChannelId)[0];

                    if (exist && !pageDic[exist.page_id]) {
                        pageDic[exist.page_id] = true; // Cờ này để không thêm trùng page vào

                        this.mappingTeams.push({
                            psid: exist.psid,
                            team: x
                        })
                    }
                })

                if (this.mappingTeams.length > 0) {
                    this.currentMappingTeam = this.mappingTeams[0];
                    this.loadMDBByPSId(this.currentMappingTeam.team?.ChannelId, this.currentMappingTeam.psid);
                }
            }
          })
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
      }
    })
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: MDBByPSIdDTO) => {
          if (res) {
            let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
            this.currentConversation = { ...model };

            this.psid = res.psid;
            this.isOpenDrawer = true;
          }
      },
      error: (error: any) => {
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

  onChangeCarrier(event: any) {
    if (event && event.DeliveryType) {
      this.filterObj.deliveryType = event.DeliveryType;
    } else {
      this.filterObj.deliveryType = '';
    }
    this.loadData(this.pageSize, this.pageIndex);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
