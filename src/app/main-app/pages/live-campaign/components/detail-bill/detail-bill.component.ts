import { TDSNotificationService } from 'tds-ui/notification';
import { SendDeliveryComponent } from './../../../bill/components/send-delivery/send-delivery.component';
import { TDSModalService } from 'tds-ui/modal';
import { PrinterService } from './../../../../services/printer.service';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { takeUntil } from 'rxjs';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PartnerService } from './../../../../services/partner.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { addDays } from 'date-fns';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataLiveCampaignBillService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-bill.service';
import { FastSaleOrderModelDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { finalize } from 'rxjs/operators';
import { TagService } from 'src/app/main-app/services/tag.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSHelperObject, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { ColumnTableDTO } from '@app/dto/common/table.dto';

@Component({
  selector: 'detail-bill',
  templateUrl: './detail-bill.component.html',
  providers: [ TDSDestroyService ]
})
export class DetailBillComponent implements OnInit {

  @Input() liveCampaignId!: string;

  public filterObj: any = {
    tags: [],
    status: '',
    bill: null,
    liveCampaignId: '',
    deliveryType: '',
    isWaitPayment: false,
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
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

  public lstTags: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  isProcessing!: boolean;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  idsModel: any = [];

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Number', name: 'Số hóa đơn', isChecked: true },
    { value: 'PartnerDisplayName', name: 'Tên khách hàng', isChecked: true },
    { value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true },
    { value: 'AmountTotal', name: 'Tổng tiền', isChecked: true },
    { value: 'AmountDeposit', name: 'Đặt cọc', isChecked: true },
    { value: 'Residual', name: 'Còn nợ', isChecked: true },
    { value: 'State', name: 'Trạng thái', isChecked: true },
    { value: 'PrintDeliveryCount', name: 'Số lần in HĐ', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
    { value: 'DateInvoice', name: 'Ngày bán', isChecked: true },
  ];


  constructor(
    private message: TDSMessageService,
    private tagService: TagService,
    private router: Router,
    private fastSaleOrderService: FastSaleOrderService,
    private oDataLiveCampaignBillService: ODataLiveCampaignBillService,
    private partnerService: PartnerService,
    private destroy$: TDSDestroyService,
    private cacheApi: THelperCacheService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private printerService: PrinterService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private notification: TDSNotificationService
  ) { }

  ngOnInit() {
    this.setFilter();
    this.loadTags();
    this.loadGridConfig()
  }

  setFilter() {
    this.filterObj.liveCampaignId = this.liveCampaignId;
    this.filterObj.isWaitPayment = false;
  }

  loadTags(){
    let type = "fastsaleorder";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    })
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignBillService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe(res => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;
    }, error => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
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
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: event.deliveryType,
      searchText: event.searchText,
      dateRange: event.dateRange ? {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate
      } : null
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
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(id: number) {
    this.router.navigateByUrl(`bill/detail/${id}`);
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
    let model = { OrderId: id, Tags: tags };
    this.fastSaleOrderService.assignTagFastSaleOrder(model)
      .subscribe((res: TDSSafeAny) => {
        if(res && res.OrderId) {
          var exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if(exits) {
            exits.Tags = JSON.stringify(tags)
          }

          this.indClickTag = -1;
          this.modelTags = [];
          this.message.success('Gán nhãn thành công!');
        }

    }, error => {
      this.indClickTag = -1;
      this.message.error('Gán nhãn thất bại!');
    });
  }


  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.filterObj.searchText = data.value;

    this.loadData(this.pageSize, this.pageIndex);
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

  print(type: string) {
    let that = this;
    if (this.isProcessing) {
      this.isLoading = false
      return
    }

    if (this.checkValueEmpty() == 1) {
      let obs: TDSSafeAny;
      switch (type) {
        case "print":
          obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.idsModel}`);
          break;
        case "printShips":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.idsModel}`);
          break;
      }
      if (TDSHelperObject.hasValue(obs)) {
        this.isProcessing = true;
        obs.pipe(takeUntil(this.destroy$), finalize(() => this.isProcessing = false)).subscribe((res: TDSSafeAny) => {
            that.printerService.printHtml(res);
        })
      }
    }
  }

  sendDelivery() {
    if (this.isProcessing) {
      this.isLoading = false
      return
    }

    if (this.checkValueEmpty() == 1) {
      this.modal.create({
        title: 'Danh sách phù hợp gửi lại mã vận đơn',
        content: SendDeliveryComponent,
        size: 'xl',
        bodyStyle:{
          'padding':'0'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: this.idsModel
        }
      });

      this.modal.afterAllClose.subscribe({
        next:(res) => {
          if(res != null){
            this.loadData(this.pageSize, this.pageIndex);
          }
          this.isLoading = false;
        }
      })
    }
  }

  approveOrder(type? :string) {
    if (this.isProcessing) {
      this.isLoading = false;
      return
    }

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.isLoading = true;

      this.modal.success({
        title: 'Xác nhận bán hàng',
        content: 'Bạn có muốn xác nhận bán hàng',
        onOk: () => {
          that.fastSaleOrderService.actionInvoiceOpen({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {

              if(res && TDSHelperString.hasValueString(res.Error) && res.Errors && !TDSHelperArray.hasListValue(res.Errors)){
                that.notification.error('Thông báo', res.Error);
              } else {
                // danh sách lỗi
              }

              that.isProcessing = false;

              if(type) {
                this.print(type);
              }

              if(res.Success) {
                that.notification.success('Thông báo', 'Xác nhận bán hàng thành công!');
              }

              this.loadData(this.pageSize, this.pageIndex);

              this.isLoading = false;
            },
            error:error => {
              this.isLoading = false;
              that.isProcessing = false;
              that.message.error(`${error?.error?.message}` || 'Xác nhận bán hàng thất bại');
            }
          })
        },
        onCancel: () => {
          that.isProcessing = false;
          this.isLoading = false;
        },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  checkValueEmpty() {
    let ids: any[] = [...this.setOfCheckedId];
    this.idsModel = [...ids];

    if (this.idsModel.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
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

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.oDataLiveCampaignBillService._keyCacheGridBill;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  loadGridConfig() {
    const key = this.oDataLiveCampaignBillService._keyCacheGridBill;
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

}
