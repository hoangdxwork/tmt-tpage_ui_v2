import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { formatDate, DatePipe } from '@angular/common';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { ModalHistoryChatComponent } from './../components/modal-history-chat/modal-history-chat.component';
import { MDBByPSIdDTO } from './../../../dto/crm-matching/mdb-by-psid.dto';
import { CRMMatchingService } from './../../../services/crm-matching.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { PartnerService } from './../../../services/partner.service';
import { addDays } from 'date-fns/esm';
import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SaleOnlineStatusModelDto, SaleOnlineStatusValueDto } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ColumnTableDTO } from 'src/app/main-app/dto/common/table.dto';
import { SortEnum, THelperCacheService, TIDictionary } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { FilterObjSOOrderModel, OdataSaleOnline_OrderService, TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CreateBillFastComponent } from '../components/create-bill-fast/create-bill-fast.component';
import { CreateBillDefaultComponent } from '../components/create-bill-default/create-bill-default.component';
import { Router } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
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
import { EditOrderV2Component } from '../components/edit-order/edit-order-v2.component';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { SaleOnlineOrderGetDetailsDto } from '@app/dto/order/so-orderlines.dto';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { ModalOrderDeletedComponent } from '../components/modal-order-deleted/modal-order-deleted.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  providers: [TDSDestroyService]
})

export class OrderComponent implements OnInit, AfterViewInit {

  @ViewChild('WidthTable') widthTable!: ElementRef;
  @ViewChild('billOrderLines') billOrderLines!: ElementRef;

  lstOfData!: ODataSaleOnline_OrderModel[];
  lstOfTeam!: CRMTeamDTO[];
  getStatus!: TIDictionary<String>;
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  idsModel: any = [];
  indClickStatus = -1;
  lstStatusTypeExt!: Array<any>;
  mappingTeams: any[] = [];
  currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  isOpenChat: boolean = false;
  orderMessage: TDSSafeAny;

  public filterObj: FilterObjSOOrderModel = {
    Tags: [],
    StatusTexts: [],
    SearchText: '',
    DateRange: {
      StartDate: addDays(new Date(), -30),
      EndDate: new Date()
    },
    TeamId: '',
    LiveCampaignId: '',
    HasTelephone: null,
    PriorityStatus: null
  }

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Code', name: 'Mã', isChecked: true },
    { value: 'CRMTeamName', name: 'Kênh kết nối', isChecked: true },
    { value: 'LiveCampaignName', name: 'Chiến dịch live', isChecked: false },
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
  filterDate: string = '';

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
    private modalService: TDSModalService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private datePipe : DatePipe,
    private chatomniConversationService: ChatomniConversationService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    this.loadAllTeam();
    this.loadTags();
    this.loadGridConfig();
    this.loadStatusTypeExt();
    this.loadSummaryStatus();
  }

  ngAfterViewInit(): void {
    this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
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
    this.filterObj.SearchText = data.value;

    let filters = this.odataSaleOnline_OrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
        next: (res: any) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = [...(res?.value || [])];
        },
        error: (error: any) => {
            this.message.error(error.error?.message);
        }
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

    this.getViewData(params).subscribe({
      next: (res: TDSSafeAny) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...(res?.value || [])];

          let lstId = this.lstOfData.map((x) => x.PartnerId);
          this.loadParnerStatus(lstId);
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
      }
    });
  }

  loadParnerStatus(params: Array<number>) {
    this.commonService.getPartnersById(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TIDictionary<String>) => {
          this.lstOfData.map( x => {
            if(res[x.PartnerId]) {
                x.PartnerStatus = res[x.PartnerId];
            }
          })
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
      }
    });
  }

  getViewData(params: string): Observable<ODataSaleOnline_OrderDTOV2> {
    this.isLoading = true;
    return this.odataSaleOnline_OrderService
      .getView(params, this.filterObj).pipe(takeUntil(this.destroy$)).pipe(finalize(() => this.isLoading = false));
  }

  loadSummaryStatus() {
    let startDate = this.filterObj?.DateRange?.StartDate as any;
    if(startDate) {
        startDate = this.datePipe.transform(new Date(startDate), 'yyyy-MM-ddT00:00:00+00:00');
    }

    let endDate = this.filterObj?.DateRange?.EndDate as any;
    if(endDate) {
        endDate = this.datePipe.transform(new Date(endDate), 'yyyy-MM-ddTHH:mm:ss+00:00');
    }

    let tagIds;
    if(this.filterObj?.Tags && this.filterObj?.Tags?.length > 0) {
      tagIds = this.filterObj.Tags.map((x: TDSSafeAny) => x).join(",") as any;
    }

    let model: SaleOnlineStatusModelDto = {
      DateStart: startDate,
      DateEnd: endDate,
      SearchText: this.filterObj?.SearchText,
      TagIds: tagIds,
      LiveCampaignId: this.filterObj?.LiveCampaignId,
      HasTelephone: this.filterObj?.HasTelephone,
      PriorityStatus: this.filterObj?.PriorityStatus,
      TeamId: this.filterObj?.TeamId,
      StatusTexts: this.filterObj?.StatusTexts
    }

    this.isTabNavs = true;
    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: Array<SaleOnlineStatusValueDto>) => {
            let tabs: TabNavsDTO[] = [];
            let total = 0;

            res?.map((x: SaleOnlineStatusValueDto, index: number) => {
                total += x.Total;
                index = index + 2;
                tabs.push({ Name: `${x.StatusText}`, Index: index, Total: x.Total });
            });

            tabs.push({ Name: "Tất cả", Index: 1, Total: total });
            tabs.sort((a, b) => a.Index - b.Index);

            this.tabNavs = [...tabs];
            this.lstOftabNavs = this.tabNavs.filter(x => Number(x.Index) > 1);
            this.isTabNavs = false;
        },
        error: (error: any) => {
            this.isTabNavs = false;
            this.message.error(error.error?.message);
        }
    });
  }

  loadGridConfig() {
    const key = this.saleOnline_OrderService._keyCacheGrid;
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

  loadAllTeam() {
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.lstOfTeam = [...(res || [])];
      },
      error: (err) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...(res?.value || [])];
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<string>();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onCreateQuicklyFS() {
    if (this.checkValueEmpty() == 1) {
      this.isLoading = true;
      this.isProcessing = true;
      let ids = [...this.setOfCheckedId];
      this.showModalCreateBillFast(ids);
    }
  }

  showModalCreateBillFast(ids: string[]) {
    this.fastSaleOrderService.getListOrderIds({ids: ids}).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
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

            this.modal.afterAllClose.pipe(takeUntil(this.destroy$)).subscribe({
              next:(x: any) =>{
                if(x) {
                  this.loadData(this.pageSize,this.pageIndex);
                }
              }
            });
          }

          this.isLoading = false;
          this.isProcessing = false
        },
        error: (error: any) => {
          this.isLoading = false;
          this.isProcessing = false
          this.message.error(error.error?.message);
        }
      });
  }

  onCreateBillDefault() {
    if (this.checkValueEmpty() == 1) {
      this.isProcessing = true
      this.fastSaleOrderService.checkPermissionCreateFSO().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          let ids = [...this.setOfCheckedId];

          this.modal.create({
            title: 'Thêm hóa đơn với sản phẩm mặc định',
            content: CreateBillDefaultComponent,
            centered: true,
            size: 'xl',
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              ids: ids
            }
          });

          this.modal.afterAllClose.pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
              if(res) {
                this.loadData(this.pageSize, this.pageIndex);
              }
            }
          })
          this.isProcessing = false
        },
        error: (err) => {
          this.message.error(err.error?.message);
          this.isProcessing = false
        }
      })
    }
  }

  onUrlCreateInvoiceFast() {
    if (this.checkValueEmpty() == 1) {
      this.isProcessing = true
      this.fastSaleOrderService.checkPermissionCreateFSO().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          let model = {
            ids: [...this.setOfCheckedId]
          }

          this.saleOnline_OrderService.getDetails(model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              delete res['@odata.context'];
              res = { ...res } as SaleOnlineOrderGetDetailsDto;

              const keyCreateBill = this.saleOnline_OrderService._keyCreateBillOrder;
              let item = JSON.stringify(res);
              localStorage.setItem(keyCreateBill, item);

              // TODO: lưu filter cache trước khi load trang add bill
              const key =  this.saleOnline_OrderService._keyCacheFilter;
              let model = { 
                filterObj: this.filterObj, 
                pageIndex: this.pageIndex, 
                pageSize: this.pageSize 
              };

              this.cacheApi.setItem(key, model);

              this.router.navigateByUrl(`bill/create?isorder=true`);
              this.isProcessing = false
            },
            error: (err) => {
              this.message.error(err.error?.message);
              this.isProcessing = false
            }
          })
        },
        error:(err) => {
          this.message.error(err.error?.message);
          this.isProcessing = false
        }
      });
    }
  }

  onSelectChange(index: TDSSafeAny) {
    this.filterObj.StatusTexts = [];
    let item = this.tabNavs.filter(f => f.Index == index)[0];

    if (item?.Name == 'Tất cả') {
      this.filterObj.StatusTexts = [];
    } else {
      this.filterObj.StatusTexts.push(item.Name);
    }

    this.pageIndex = 1;
    this.indClickTag = "";
    this.filterObj.Tags = [];

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
    if(tags == null) {
      this.message.error("Vui lòng nhập tên thẻ!");
      return;
    }
    let model = { OrderId: id, Tags: tags };
    this.saleOnline_OrderService.assignSaleOnlineOrder(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if (res && res.OrderId) {
            let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
            if (exits) {
              exits.Tags = JSON.stringify(tags)
            }

            this.indClickTag = "";
            this.modelTags = [];
            this.message.success(Message.Tag.InsertSuccess);
        }
      },
      error: (error: any) => {
          this.indClickTag = "";
          this.message.error(`${error?.error?.message}` || Message.Tag.InsertFail);
      }
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
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  removeFilterCache(){
    const key =  this.saleOnline_OrderService._keyCacheFilter;
    this.cacheApi.removeItem(key);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    const key =  this.saleOnline_OrderService._keyCacheFilter;

    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          if(TDSHelperObject.hasValue(res)){
            let dataObj = JSON.parse(res.value)?.value;
            if(dataObj){
                this.filterObj = dataObj.filterObj;
                this.filterObj!.DateRange!.StartDate = new Date(dataObj.filterObj.DateRange.StartDate);
                this.filterObj!.DateRange!.EndDate = new Date(dataObj.filterObj.DateRange.EndDate);
                this.pageIndex = dataObj.pageIndex;
                this.pageSize = dataObj.pageSize;
            }
          } else {
            this.pageSize = params.pageSize;
          }

          this.removeFilterCache();
          this.loadData(params.pageSize, params.pageIndex);
      }
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = "";
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.filterObj = {
      Tags: [],
      StatusTexts: [],
      SearchText: '',
      DateRange: {
        StartDate: addDays(new Date(), -30),
        EndDate: new Date(),
      },
      LiveCampaignId: null,
      HasTelephone: null,
      PriorityStatus: null
    }

    this.loadData(this.pageSize, this.pageIndex);
    this.loadSummaryStatus();
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

    this.filterObj = {
      Tags: [...(event?.Tags || [])],
      StatusTexts: [...(event?.StatusTexts || [])],
      SearchText: event?.SearchText,
      DateRange: {
        StartDate: event?.DateRange?.StartDate || null,
        EndDate: event?.DateRange?.EndDate || null
      },
      TeamId: event?.TeamId || null,
      LiveCampaignId: event?.LiveCampaignId || null,
      HasTelephone: event?.HasTelephone || null,
      PriorityStatus: event?.PriorityStatus || null
    }

    if (TDSHelperArray.hasListValue(event?.StatusTexts)) {
      this.tabNavs = this.lstOftabNavs.filter(f => event.StatusTexts.includes(f.Name));
    } else {
      this.tabNavs = this.lstOftabNavs;
    }

    this.removeCheckedRow();
    this.loadData(this.pageSize, this.pageIndex);
    this.loadSummaryStatus();
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
      this.isLoading = true;

      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              this.isLoading = false;

              if(res && res.Id) {
                delete res['@odata.context'];

                const modal = this.modal.create({
                    title: res.Code ? `Sửa đơn hàng <span class="text-primary-1 font-semibold text-title-1 pl-2">${res.Code}</span>` : `Sửa đơn hàng`,
                    content: EditOrderV2Component,
                    size: 'xl',
                    viewContainerRef: this.viewContainerRef,
                    bodyStyle:{
                      'padding': '0'
                    },
                    componentParams: {
                      dataItem: { ...res }
                    }
                })

                modal.afterClose?.pipe(takeUntil(this.destroy$)).subscribe((obs: string) => {
                    if (TDSHelperString.hasValueString(obs) && obs == 'onLoadPage') {
                        this.loadData(this.pageSize, this.pageIndex);
                    }
                })
              }
          },
          error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          }
      });
    }
  }

  onDelete(id: string, code?: string) {
    this.modal.error({
      title: 'Xóa đơn hàng',
      content: 'Bạn có chắc muốn xóa đơn hàng',
      onOk: () => this.removeOrder(id, code),
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  removeOrder(id: string, code?: string) {
    this.isLoading = true;
    this.saleOnline_OrderService.remove(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.message.info(`${Message.Order.DeleteSuccess} ${code || ''}`);
          this.refreshDataCurrent();
          this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error.error?.message);
      }
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
    if (this.isProcessing) { 
      return 
    }

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
    this.commonService.getStatusTypeExt().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.lstStatusTypeExt = [...res];
        this.cdRef.markForCheck();
      },
      error: (err) => {
        this.message.error(err.error?.message);
        this.cdRef.markForCheck();
      }
    });
  }

  updateStatusSaleOnline(data: any, status: any) {
    let value = status.Text;

    this.saleOnline_OrderService.updateStatusSaleOnline(data.Id, value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.message.success('Cập nhật thành công');
          data.StatusText = status.Text;

          this.loadSummaryStatus();
          this.cdRef.markForCheck();
      },
      error: (error: any) => {
          this.message.error(error.error?.message);
      }
    });
  }

  printMultiOrder() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      ids.map((x: string) => {
        this.saleOnline_OrderService.getById(x).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
              if (res) {
                  this.orderPrintService.printIpFromOrder(res);
              }
            },
            error: (error: any) => {
              this.message.error( `${error?.error?.message}` || 'Tải thông tin đơn hàng đã xảy ra lỗi');
            }
        })
      })
    }
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;
    this.isOpenChat = true;
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

          this.isOpenChat = false;
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
                  let exist = obs.filter((r: any) => r.ChannelId == x.ChannelId)[0];

                  if (exist && !pageDic[exist.ChannelId]) {
                    pageDic[exist.ChannelId] = true; // Cờ này để không thêm trùng page vàoss
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
            }
          });
      },
      error: (error: any) => {
        this.isOpenChat = false;
        this.isLoading = false;
        this.message.error(error.error?.message);
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
          this.message.error(error.error?.message);
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

  removeCheckedRow(){
    this.setOfCheckedId = new Set<string>();
  }

  directPage(url: string){
    this.router.navigateByUrl(url);
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
      this.onCreateQuicklyFS();
    }
  }

  showModalCancelOrder(livecampaignId: string) {
    this.modal.create({
      title: 'Đơn hàng đã hủy trong chiến dịch live',
      content: ModalOrderDeletedComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        livecampaignId: livecampaignId
      }
  });
  }

  onChangeFilterDate() {
    let data = this.lstOfData;
    switch(this.filterDate) {
      case '':
        this.filterDate = 'asc';
        data = data.sort((a: ODataSaleOnline_OrderModel, b: ODataSaleOnline_OrderModel) => new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime());
      break;

      case 'asc':
        this.filterDate = 'desc';
        data = data.sort((a: ODataSaleOnline_OrderModel, b: ODataSaleOnline_OrderModel) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());

      break;

      case'desc':
        this.filterDate = '';
      break;
    }

    this.lstOfData = [...data];
  }
}
