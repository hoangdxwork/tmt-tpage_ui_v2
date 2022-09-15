import { TagService } from './../../../../services/tag.service';
import { FilterObjSOOrderModel } from './../../../../services/mock-odata/odata-saleonlineorder.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { CRMMatchingService } from '../../../../services/crm-matching.service';
import { MDBByPSIdDTO } from '../../../../dto/crm-matching/mdb-by-psid.dto';
import { CRMTeamService } from '../../../../services/crm-team.service';
import { PartnerService } from '../../../../services/partner.service';
import { QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { addDays } from 'date-fns';
import { ODataLiveCampaignOrderService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-order.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize, takeUntil } from 'rxjs/operators';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSModalService } from 'tds-ui/modal';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { EditOrderV2Component } from '@app/pages/order/components/edit-order/edit-order-v2.component';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrinterService } from '@app/services/printer.service';
import { OrderPrintService } from '@app/services/print/order-print.service';
import { CreateBillFastComponent } from '@app/pages/order/components/create-bill-fast/create-bill-fast.component';
import { GetListOrderIdsDTO } from '@app/dto/saleonlineorder/list-order-ids.dto';
import { FastSaleOrderService } from '@app/services/fast-sale-order.service';
import { ModalHistoryChatComponent } from '@app/pages/order/components/modal-history-chat/modal-history-chat.component';

@Component({
  selector: 'detail-order-livecampaign',
  templateUrl: './detail-order-livecampaign.component.html',
  providers: [TDSDestroyService]
})

export class DetailOrderLiveCampaignComponent implements OnInit, AfterViewInit {

  @ViewChild('WidthTable') widthTable!: ElementRef;
  @ViewChild('expandOrderLivecampaign') expandOrderLivecampaign!: ElementRef;

  @Input() liveCampaignId!: string;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  expandSet = new Set<string>();
  marginLeftCollapse: number = 0;
  widthCollapse: number = 0;
  paddingCollapse: number = 36;

  public filterObj: FilterObjSOOrderModel = {
    tags: [],
    status: [],
    searchText: '',
    dateRange: null
  }

  public lstDataTag: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  constructor(private message: TDSMessageService,
    private modal: TDSModalService,
    private printerService: PrinterService,
    private orderPrintService: OrderPrintService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataLiveCampaignOrderService: ODataLiveCampaignOrderService,
    private fastSaleOrderService: FastSaleOrderService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private destroy$: TDSDestroyService,
    private resizeObserver: TDSResizeObserver,
    private tagService: TagService) { }

  ngOnInit(): void {
    this.loadTags();
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
    let filters = this.odataLiveCampaignOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
      next: (res: TDSSafeAny) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...res.value];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || Message.CanNotLoadData);
      }
    });
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.odataLiveCampaignOrderService
        .getView(params, this.filterObj, this.liveCampaignId)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false ));
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj = {
      tags: event.tags,
      status: event?.status != 'Tất cả' ? event?.status : null,
      searchText: event.searchText,
      dateRange: event.dateRange ? {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate,
      } : null
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;

    this.filterObj = {
      tags: [],
      status: [],
      searchText: '',
      dateRange: {} as any
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(item: QuickSaleOnlineOrderModel) {
    if(item && item.Id) {
      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

            if(res && res.Id) {
              delete res['@odata.context'];

              const modal = this.modal.create({
                  content: EditOrderV2Component,
                  size: 'xl',
                  viewContainerRef: this.viewContainerRef,
                  title: res.Code ? `Sửa đơn hàng <span class="text-primary-1 font-semibold text-title-1 pl-2">${res.Code}</span>` : `Sửa đơn hàng`,
                  bodyStyle:{
                    'padding': '0'
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
          },
          error: (error: any) => {
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
    this.saleOnline_OrderService.remove(id).subscribe({
      next: (res: any) => {
          this.message.info(`${Message.Order.DeleteSuccess} ${code || ''}`);
          this.loadData(this.pageSize, this.pageIndex);
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || Message.ErrorOccurred);
      }
    });
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đơn hàng":
        return "success";
      case "Hủy":
        return "error";
      default:
        return "warning";
    }
  }

  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.filterObj.searchText = data.value;

    let filters = this.odataLiveCampaignOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
        next: (res: any) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = [...res.value];
        },
        error: (error: any) => {
            this.message.error(error?.error?.message || 'Tải dữ liệu phiếu bán hàng thất bại!');
        }
    });
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any): any => {

          let pageIds: any = [];
          res.map((x: any) => {
            pageIds.push(x.page_id);
          });

          if (pageIds.length == 0) {
            return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
            next: (teams: any): any => {

                if (teams.length == 0) {
                  return this.message.error('Không có kênh kết nối với khách hàng này.');
                }

                this.mappingTeams = [];
                let pageDic = {} as any;

                teams.map((x: any) => {
                  let exist = res.filter((r: any) => r.page_id == x.ChannelId)[0];

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
                  this.loadMDBByPSId(this.currentMappingTeam.team.ChannelId, this.currentMappingTeam.psid);
                }
            }
          });
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
    this.crmMatchingService.getMDBByPSId(pageId, psid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: MDBByPSIdDTO) => {
        if (res) {
          let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
          this.currentConversation = { ...model };

          this.psid = res.psid;
          this.isOpenDrawer = true;
        }
      }, error => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
      })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.ChannelId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  ngAfterViewInit(): void {

    this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse
    this.resizeObserver?.observe(this.widthTable).subscribe(() => {
        this.widthCollapse = this.widthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.widthTable?.nativeElement?.click()
      });

    setTimeout(() => {
      let that = this;

      if (that.expandOrderLivecampaign) {
        let wrapScroll = that.expandOrderLivecampaign?.nativeElement?.closest('.tds-table-body');

        wrapScroll?.addEventListener('scroll', function () {
          let scrollleft = wrapScroll.scrollLeft;
          that.marginLeftCollapse = scrollleft;
        });
      }

    }, 500);
  }

  printCustomer() {
    let obs: TDSSafeAny;
    obs = this.printerService.printUrl(`/SaleOnline_LiveCampaign/PrintCustomerWaitCheckOut?id=${this.liveCampaignId}`);
    obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.printerService.printHtml(res);
          this.isLoading = false;

      }, (error: TDSSafeAny) => {
        this.isLoading = false;
        if(error?.error?.message) {
          this.message.error(error?.error?.message);
        }
    });

    if(!obs) {
      this.isLoading = false;
    }
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
            this.message.error(`${error?.error?.message}` || 'Load thông tin đơn hàng đã xảy ra lỗi');
          }
        })
      })
    }
  }

  onCreateQuicklyFS() {
    if (this.checkValueEmpty() == 1) {
      this.isLoading = true;
      let ids = [...this.setOfCheckedId];
      this.showModalCreateBillFast(ids)
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
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
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

  showModalHistoryChat(orderId: string) {
    const modal = this.modal.create({
      title: 'Lịch sử gửi tin nhắn',
      content: ModalHistoryChatComponent,
      size: "xl",
      bodyStyle: {
        padding: '0px',
      },
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: orderId,
        type: "order"
      }
    });
    modal.afterClose.subscribe(result => {
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
