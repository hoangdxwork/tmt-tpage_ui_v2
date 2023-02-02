import { CRMTeamDTO } from './../../../../dto/team/team.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { ChatomniConversationService } from './../../../../services/chatomni-service/chatomni-conversation.service';
import { addDays } from 'date-fns';
import { SaleOnlineStatusModelDto, SaleOnlineStatusValueDto } from './../../../../dto/saleonlineorder/sale-online-order.dto';
import { TIDictionary } from './../../../../../lib/dto/dictionary.dto';
import { CommonService } from './../../../../services/common.service';
import { TagService } from './../../../../services/tag.service';
import { FilterObjSOOrderModel, TabNavsDTO } from './../../../../services/mock-odata/odata-saleonlineorder.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { CRMMatchingService } from '../../../../services/crm-matching.service';
import { MDBByPSIdDTO } from '../../../../dto/crm-matching/mdb-by-psid.dto';
import { CRMTeamService } from '../../../../services/crm-team.service';
import { PartnerService } from '../../../../services/partner.service';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ODataLiveCampaignOrderService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-order.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize, takeUntil } from 'rxjs/operators';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
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
import { ODataSaleOnline_OrderModel } from '@app/dto/saleonlineorder/odata-saleonline-order.dto';

@Component({
  selector: 'table-all-order',
  templateUrl: './table-all-order.component.html',
})
export class TableAllOrderComponent implements OnInit {
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
  lstStatusTypeExt!: Array<any>;
  indClickTag = "";
  lstOfTeam!: CRMTeamDTO[];

  public filterObj: FilterObjSOOrderModel = {
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

  public lstDataTag: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<ODataSaleOnline_OrderModel> = [];
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

  isTabNavs: boolean = false;
  public tabNavs: Array<TabNavsDTO> = [];
  public lstOftabNavs: Array<TabNavsDTO> = [];
  public summaryStatus: Array<TabNavsDTO> = [];

  filterDate: string = '';

  constructor(
    private message: TDSMessageService,
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
    private tagService: TagService,
    private cdRef: ChangeDetectorRef,
    private commonService: CommonService,
    private chatomniConversationService: ChatomniConversationService) { }

  ngOnInit(): void {
    this.loadAllTeam();
    this.loadTags();
    this.loadStatusTypeExt();
    this.loadSummaryStatus();
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

        let lstId = this.lstOfData.map((x) => x.PartnerId);
        this.loadParnerStatus(lstId);
      },
      error: (error: any) => {
        this.message.error(`${error?.error?.message}` || Message.CanNotLoadData);
      }
    });
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

  getViewData(params: string) {
    this.isLoading = true;
    return this.odataLiveCampaignOrderService
      .getView(params, this.filterObj, this.liveCampaignId)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false));
  }

  loadParnerStatus(params: Array<number>) {
    this.commonService.getPartnersById(params).subscribe({
      next: (res: TIDictionary<String>) => {
        if (res) {
          this.lstOfData.map(x => {
            if (res[x.PartnerId]) {
              x.PartnerStatus = res[x.PartnerId];
            }
          })
        }
      },
      error: (error: any) => {
        this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
      }
    });
  }


  onLoadOption(event: FilterObjSOOrderModel): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    let lstStatus = event?.StatusTexts?.filter(x => x != 'Tất cả');

    this.filterObj = {
      Tags: event?.Tags,
      StatusTexts: lstStatus ? lstStatus : [],
      SearchText: event?.SearchText,
      DateRange: {
        StartDate: event?.DateRange?.StartDate,
        EndDate: event?.DateRange?.EndDate,
      },
      LiveCampaignId: null,
      HasTelephone: event.HasTelephone,
      PriorityStatus: event.PriorityStatus
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;

    this.filterObj = {
      Tags: [],
      StatusTexts: [],
      SearchText: '',
      DateRange: {} as any,
      LiveCampaignId: null,
      HasTelephone: null,
      PriorityStatus: null
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(item: ODataSaleOnline_OrderModel) {
    if (item && item.Id) {
      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

          if (res && res.Id) {
            delete res['@odata.context'];

            const modal = this.modal.create({
              content: EditOrderV2Component,
              size: 'xl',
              viewContainerRef: this.viewContainerRef,
              title: res.Code ? `Sửa đơn hàng <span class="text-primary-1 font-semibold text-title-1 pl-2">${res.Code}</span>` : `Sửa đơn hàng`,
              bodyStyle: {
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
        this.loadData(this.pageSize, this.pageIndex);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` || Message.ErrorOccurred);
      }
    });
  }

  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.filterObj.SearchText = data.value;

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
      next: (res: any): any => {

        let pageIds: any = [];
        res.map((x: any) => {
          pageIds.push(x.ChannelId);
        });

        if (pageIds.length == 0) {
          this.isLoading = false;
          return this.message.error('Không có kênh kết nối với khách hàng này.');
        }

        this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
          next: (teams: any): any => {

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
          }
        });
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
    this.isLoading = true;

    obs = this.printerService.printUrl(`/SaleOnline_LiveCampaign/PrintCustomerWaitCheckOut?id=${this.liveCampaignId}`);
    obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.printerService.printHtml(res);
      this.isLoading = false;

    }, (error: TDSSafeAny) => {
      this.isLoading = false;
      if (error?.error?.message) {
        this.message.error(error?.error?.message);
      }
    });

    if (!obs) {
      this.isLoading = false;
    }
  }

  printMultiOrder() {
    if (this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      this.isLoading = true;

      ids.map((x: string) => {
        this.saleOnline_OrderService.getById(x).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            if (res) {
              this.orderPrintService.printIpFromOrder(res);
            }

            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Load thông tin đơn hàng đã xảy ra lỗi');
          }
        })
      })
    }
  }

  onCreateQuicklyFS() {
    if (this.checkValueEmpty() == 1) {
      this.fastSaleOrderService.checkPermissionQuickCreateFSO().subscribe({
        next:(err) => {
          let ids = [...this.setOfCheckedId];
          this.showModalCreateBillFast(ids);
        },
        error:(err) => {
          this.message.error(err?.error?.message || 'Đã có lỗi xảy ra');
        }
      })
    }
  }

  showModalCreateBillFast(ids: string[]) {
    this.isLoading = true;

    this.fastSaleOrderService.getListOrderIds({ ids: ids }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res) {
          const modal = this.modal.create({
            title: 'Tạo hóa đơn nhanh',
            content: CreateBillFastComponent,
            centered: true,
            size: 'xl',
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              lstData: [...res.value] as GetListOrderIdsDTO[]
            }
          });

          modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              if(res) {
                this.loadData(this.pageSize, this.pageIndex);
              }
            }
          })
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
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
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: orderId,
        type: "order"
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
          this.message.error(error.error.message || 'Cập nhật thất bại');
      }
    });
  }

  loadSummaryStatus() {
    let model: SaleOnlineStatusModelDto = {
      DateStart: this.filterObj?.DateRange?.StartDate,
      DateEnd: this.filterObj?.DateRange?.EndDate,
      SearchText: this.filterObj?.SearchText,
      TagIds: this.filterObj?.Tags?.map((x: TDSSafeAny) => x.Id).join(","),
    }

    this.isTabNavs = true;
    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$),
      finalize(() => this.isTabNavs = false)).subscribe({
        next: (res: Array<SaleOnlineStatusValueDto>) => {
            let tabs: TabNavsDTO[] = [];
            let total = 0;

            res?.map((x: TDSSafeAny, index: number) => {
                total += x.Total;
                index = index + 2;

                tabs.push({ Name: `${x.ShowState}`, Index: index, Total: x.Total });
            });

            tabs.push({ Name: "Tất cả", Index: 1, Total: total });
            tabs.sort((a, b) => a.Index - b.Index);

            this.tabNavs = [...tabs];
            this.lstOftabNavs = this.tabNavs.filter(x => Number(x.Index) > 1);
        }
      });
  }

  loadStatusTypeExt() {
    this.commonService.getStatusTypeExt().subscribe(res => {
      this.lstStatusTypeExt = [...res];
      this.cdRef.markForCheck();
    });
  }

  openTag(id: string, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag(): void {
    this.indClickTag = "";
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
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
