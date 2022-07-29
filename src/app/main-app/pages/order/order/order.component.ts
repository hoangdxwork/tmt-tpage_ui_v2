import { ModalHistoryChatComponent } from './../components/modal-history-chat/modal-history-chat.component';
import { ConversationMatchingItem } from './../../../dto/conversation-all/conversation-all.dto';
import { MDBByPSIdDTO } from './../../../dto/crm-matching/mdb-by-psid.dto';
import { CRMMatchingService } from './../../../services/crm-matching.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { PartnerService } from './../../../services/partner.service';
import { addDays } from 'date-fns/esm';
import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewChecked, AfterViewInit, AfterContentChecked } from '@angular/core';
import { SaleOnlineOrderSummaryStatusDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ColumnTableDTO } from 'src/app/main-app/dto/common/table.dto';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { FilterObjSOOrderModel, OdataSaleOnline_OrderService, TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { Subject, fromEvent, Observable } from 'rxjs';
import { takeUntil, finalize, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EditOrderComponent } from '../components/edit-order/edit-order.component';
import { CreateBillFastComponent } from '../components/create-bill-fast/create-bill-fast.component';
import { CreateBillDefaultComponent } from '../components/create-bill-default/create-bill-default.component';
import { Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSMessageService } from 'tds-ui/message';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { GenerateMessageTypeEnum } from 'src/app/main-app/dto/conversation/message.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { GetListOrderIdsDTO } from 'src/app/main-app/dto/saleonlineorder/list-order-ids.dto';
import { HostListener } from '@angular/core';
import { ODataSaleOnline_OrderDTOV2, ODataSaleOnline_OrderModel } from 'src/app/main-app/dto/saleonlineorder/odata-saleonline-order.dto';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})

export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('WidthTable') widthTable!: ElementRef;
  @ViewChild('billOrderLines') billOrderLines!: ElementRef;

  lstOfData!: ODataSaleOnline_OrderModel[];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  idsModel: any = [];
  indClickStatus = -1;
  lstStatusTypeExt!: Array<any>;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ConversationMatchingItem;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  public filterObj: FilterObjSOOrderModel = {
    tags: [],
    status: [],
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date()
    }
  }

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Code', name: 'Mã', isChecked: true },
    { value: 'CRMTeamName', name: 'Kênh kết nối', isChecked: true },
    { value: 'Name', name: 'Tên', isChecked: true },
    { value: 'Address', name: 'Địa chỉ', isChecked: false },
    { value: 'TotalAmount', name: 'Tổng tiền', isChecked: true },
    { value: 'TotalQuantity', name: 'Tổng SL', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: false },
    { value: 'StatusText', name: 'Trạng thái', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
  ];

  public lstOftabNavs: Array<TabNavsDTO> = [];
  public tabNavs: Array<TabNavsDTO> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  tabIndex: number = 1;
  public lstDataTag: Array<TDSSafeAny> = [];

  expandSet = new Set<string>();
  isOpenMessageFacebook = false;
  indClickTag = "";

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  paddingCollapse: number = 36;
  marginLeftCollapse: number = 0;
  isLoadingCollapse: boolean = false;
  widthCollapse: number = 0;
  isTabNavs: boolean = false;
  isProcessing: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef,
    private fastSaleOrderService: FastSaleOrderService,
    private tagService: TagService,
    private router: Router,
    private orderPrintService: OrderPrintService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService,
    private cacheApi: THelperCacheService,
    private excelExportService: ExcelExportService,
    private resizeObserver: TDSResizeObserver,
    private commonService: CommonService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private modalService: TDSModalService) {
  }

  ngOnInit(): void {
    this.loadTags();
    this.loadGridConfig();
    this.loadStatusTypeExt();
    this.loadSummaryStatus();
  }

  ngAfterViewInit(): void {

    this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse
    this.resizeObserver
      .observe(this.widthTable)
      .subscribe(() => {
        this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.widthTable?.nativeElement?.click()
      });

    setTimeout(() => {
      let that = this;

      if (that.billOrderLines) {
        let wrapScroll = that.billOrderLines?.nativeElement?.closest('.tds-table-body');

        wrapScroll?.addEventListener('scroll', function () {
          let scrollleft = wrapScroll.scrollLeft;
          that.marginLeftCollapse = scrollleft;
        });
      }

    }, 500);
  }

  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = "";
    this.filterObj.searchText = data.value;

    let filters = this.odataSaleOnline_OrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: any) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
    }, error => {
      this.message.error(error?.error?.message || 'Tải dữ liệu phiếu bán hàng thất bại!');
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach(item => this.updateCheckedSet(item.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(item => this.setOfCheckedId.has(item.Id));
    this.indeterminate = this.lstOfData.some(item => this.setOfCheckedId.has(item.Id)) && !this.checked;
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataSaleOnline_OrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
    }, error => {
      this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
    });
  }

  getViewData(params: string): Observable<ODataSaleOnline_OrderDTOV2> {
    this.isLoading = true;
    return this.odataSaleOnline_OrderService
      .getView(params, this.filterObj).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false));
  }

  loadSummaryStatus() {
    let model: SaleOnlineOrderSummaryStatusDTO = {
      DateStart: this.filterObj.dateRange.startDate,
      DateEnd: this.filterObj.dateRange.endDate,
      SearchText: this.filterObj.searchText,
      TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
    }


    this.isTabNavs = true;
    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$),
      finalize(() => this.isTabNavs = false)).subscribe((res: Array<TDSSafeAny>) => {

        let tabs: TabNavsDTO[] = [];
        let total = 0;
        res.map((x: TDSSafeAny, index: number) => {

          total += x.Total;
          index = index + 2;

          tabs.push({ Name: `${x.StatusText}`, Index: index, Total: x.Total });
        });

        tabs.push({ Name: "Tất cả", Index: 1, Total: total });
        tabs.sort((a, b) => a.Index - b.Index);

        this.tabNavs = [...tabs];
        this.lstOftabNavs = this.tabNavs;
      });
  }

  loadGridConfig() {
    const key = this.saleOnline_OrderService._keyCacheGrid;
    this.cacheApi.getItem(key).subscribe((res: TDSSafeAny) => {
      if (res && res.value) {
        let jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    })
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onCreateBillFast() {
    if (this.checkValueEmpty() == 1) {
      this.isLoading = true;
      let ids = [...this.setOfCheckedId];
      this.showModalCreateBillFast(ids)
    }
  }

  showModalCreateBillFast(ids: string[]) {
    this.fastSaleOrderService.getListOrderIds({ ids: ids })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
        if (res) {
          this.modal.create({
            title: 'Tạo hóa đơn nhanh',
            content: CreateBillFastComponent,
            centered: true,
            size: 'xl',
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              lstData: [...res.value] as GetListOrderIdsDTO[]
            }
          });
        }
      }, error => {
        this.message.error(error?.error?.message ? error?.error?.message : 'Đã xảy ra lỗi');
      });
  }

  onCreateBillDefault() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      this.modal.create({
        title: 'Thêm hóa đơn với sản phẩm mặc định',
        content: CreateBillDefaultComponent,
        centered: true,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: ids,
        }
      });
    }
  }

  onUrlCreateInvoiceFast() {
    if (this.checkValueEmpty() == 1) {
      let model = {
        ids: [...this.setOfCheckedId]
      }
      this.isLoading = true;

      this.saleOnline_OrderService.getDetails(model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res) => {
        const key = this.saleOnline_OrderService._keyCreateBillOrder;
        delete res['@odata.context'];
        this.cacheApi.setItem(key, res);
        // TODO: lưu filter cache trước khi load trang add bill
        this.storeFilterCache();
        this.router.navigateByUrl(`bill/create`);
      },
        error => {
          this.message.error(error?.error?.message || 'Không thể tạo hóa đơn');
      })
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
    this.indClickTag = "";
    this.filterObj.tags = [];

    this.indeterminate = false;
    this.loadData(this.pageSize, this.pageIndex);
  }

  openTag(id: string, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = "";
  }

  assignTags(id: string, tags: TDSSafeAny) {
    let model = { OrderId: id, Tags: tags };
    this.saleOnline_OrderService.assignSaleOnlineOrder(model)
      .subscribe((res: TDSSafeAny) => {
        if (res && res.OrderId) {
          let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if (exits) {
            exits.Tags = JSON.stringify(tags)
          }

          this.indClickTag = "";
          this.modelTags = [];
          this.message.success(Message.Tag.InsertSuccess);
        }

      }, error => {
        this.indClickTag = "";
        this.message.error(`${error?.error?.message}` || Message.Tag.InsertFail);
      });
  }

  showModalHistoryChat(orderId: string) {
    const modal = this.modalService.create({
      title: 'Lịch sử gửi tin nhắn',
      content: ModalHistoryChatComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: orderId,
        type: "order"
      }
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    })
  }

  getColorStatusText(status: string): TDSTagStatusType {
    let value = this.lstStatusTypeExt?.filter(x => x.Text === status)[0]?.Text;
    switch (value) {
      case "Đơn hàng":
        return "primary";
      case "Nháp":
        return "info";
      case "Hủy":
        return "warning";
      case "Hủy bỏ":
        return "secondary";
      case "Bom hàng":
        return "error";
      case "Đã thanh toán":
        return "success";
      default:
        return "secondary";
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  storeFilterCache(){
    const key =  this.saleOnline_OrderService._keyCacheFilter;
    this.cacheApi.setItem(key,{filterObj: this.filterObj, pageIndex: this.pageIndex, pageSize: this.pageSize});
  }

  removeFilterCache(){
    const key =  this.saleOnline_OrderService._keyCacheFilter;
    this.cacheApi.removeItem(key);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    const key =  this.saleOnline_OrderService._keyCacheFilter;
    this.cacheApi.getItem(key).subscribe((res)=>{

      if(TDSHelperObject.hasValue(res)){
        let dataObj = JSON.parse(res.value)?.value;

        if(dataObj){
          this.filterObj = dataObj.filterObj;
          this.filterObj.dateRange.startDate = new Date(dataObj.filterObj.dateRange.startDate);
          this.filterObj.dateRange.endDate = new Date(dataObj.filterObj.dateRange.endDate);
          this.pageIndex = dataObj.pageIndex;
          this.pageSize = dataObj.pageSize;
        }
      }else{
        this.pageSize = params.pageSize;
      }
      this.removeFilterCache();
      this.loadData(params.pageSize, params.pageIndex);
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = "";
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.filterObj = {
      tags: [],
      status: [],
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  // Refresh nhưng không refresh lại Tab, Index
  refreshDataCurrent() {
    this.indClickTag = "";

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.loadData(this.pageSize, this.pageIndex);
  }

  onLoadOption(event: FilterObjSOOrderModel) {
    this.tabIndex = 1;
    this.pageIndex = 1;

    this.filterObj.tags = event.tags;
    this.filterObj.status = event.status;

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

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.saleOnline_OrderService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  onEdit(item: ODataSaleOnline_OrderModel) {
    if(item && item.Id) {
      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

          if(res && res.Id) {
            delete res['@odata.context'];

            const modal = this.modal.create({
                content: EditOrderComponent,
                size: 'xl',
                viewContainerRef: this.viewContainerRef,
                bodyStyle:{
                  'padding':'0'
                },
                componentParams: {
                  dataItem: { ...res }
                }
            })

            modal.afterClose?.subscribe((obs: string) => {
                if (TDSHelperString.hasValueString(obs) && obs == 'onLoadPage') {
                    this.loadData(this.pageSize, this.pageIndex);
                }
            })
          }
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
    }

  }

  onRemove(id: string, code: string) {
    this.modal.error({
      title: 'Xóa đơn hàng',
      content: 'Bạn có chắc muốn xóa đơn hàng',
      onOk: () => this.remove(id, code),
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  remove(id: string, code: string) {
    this.isLoading = true;
    this.saleOnline_OrderService.remove(id).pipe(finalize(() => this.isLoading = false))
      .subscribe((res: TDSSafeAny) => {
        this.message.info(`${Message.Order.DeleteSuccess} ${code || ''}`);
        this.refreshDataCurrent();
      }, error => {
        this.message.error(`${error?.error?.message}` || Message.ErrorOccurred);
      });
  }

  checkValueEmpty() {
    let ids = [...this.setOfCheckedId];
    if (ids.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
  }

  onExportExcel() {
    if (this.isProcessing) { return }
    let filter = {
      logic: 'and',
      filters: [
        {
          field: "DateCreated",
          operator: "gte",
          value: addDays(new Date(), -30).toISOString()
        },
        {
          field: "DateCreated",
          operator: "lte",
          value: new Date().toISOString()
        }
      ]
    };

    let model = {
      data: JSON.stringify({ Filter: filter }),
      ids: [...this.setOfCheckedId]
    }

    this.excelExportService.exportPost(`/SaleOnline_Order/ExportFile`, model, `don_hang_online`)
      .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
      .subscribe();
  }

  // Gủi tin nhắn FB
  sendMessage() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      this.modal.create({
        title: 'Gửi tin nhắn Facebook',
        content: SendMessageComponent,
        size: 'lg',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          orderIds: ids,
          messageType: GenerateMessageTypeEnum.Order
        }
      })
    }
  }
  showMessageModal(orderMessage: TDSSafeAny) {
    this.modal.create({
      title: 'Gửi tin nhắn Facebook',
      size: 'lg',
      content: SendMessageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderIds: [orderMessage.Id],
        messageType: GenerateMessageTypeEnum.Order
      }
    });
  }

  // Nhãn
  loadStatusTypeExt() {
    this.commonService.getStatusTypeExt().subscribe(res => {
      this.lstStatusTypeExt = [...res];
      this.cdRef.markForCheck();
    });
  }

  updateStatusSaleOnline(data: any, status: any) {
    let value = status.Text;

    this.saleOnline_OrderService.updateStatusSaleOnline(data.Id, value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.message.success('Cập nhật thành công');
      data.StatusText = status.Text;

      this.loadSummaryStatus();
      this.cdRef.markForCheck();
    }, error => {
      this.message.error(error.error.message ?? 'Cập nhật thất bại');
    });
  }

  printMultiOrder() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      ids.map((x: string) => {
        this.saleOnline_OrderService.getById(x).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res) {
            this.orderPrintService.printIpFromOrder(res);
          }
        }, error => {
          this.message.error('Load thông tin đơn hàng đã xảy ra lỗi');
        })
      })
    }
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe((res: any): any => {

      let pageIds: any = [];
      res.map((x: any) => {
        pageIds.push(x.page_id);
      });

      if (pageIds.length == 0) {
        return this.message.error('Không có kênh kết nối với khách hàng này.');
      }

      this.crmTeamService.getActiveByPageIds$(pageIds)
        .pipe(takeUntil(this.destroy$)).subscribe((teams: any): any => {

          if (teams.length == 0) {
            return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.mappingTeams = [];
          let pageDic = {} as any;

          teams.map((x: any) => {
            let exist = res.filter((r: any) => r.page_id == x.Facebook_PageId)[0];

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
            this.loadMDBByPSId(this.currentMappingTeam.team.Facebook_PageId, this.currentMappingTeam.psid);
          }
        });
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
    })
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: MDBByPSIdDTO) => {
        if (res) {
          res["keyTags"] = {};

          if (res.tags && res.tags.length > 0) {
            res.tags.map((x: any) => {
              res["keyTags"][x.id] = true;
            })
          } else {
            res.tags = [];
          }

          this.currentConversation = { ...res, ...this.currentConversation };
          this.psid = res.psid;
          this.isOpenDrawer = true;
        }
      }, error => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
      })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.Facebook_PageId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  removeCheckedRow(){
    this.setOfCheckedId = new Set<string>();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEventCreate(event: KeyboardEvent) {
    if (event.key === 'F9') {
      this.onUrlCreateInvoiceFast();
    }
    else if (event.key === 'F8') {
      this.onCreateBillDefault();
    }
    else if (event.key === 'F10') {
      this.onCreateBillFast();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
